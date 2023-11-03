import React, { useState } from 'react';
import { Button, Grid } from '@material-ui/core';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { Progress } from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';
import { EntityOpsLevelMaturityProgress } from './EntityOpsLevelMaturityProgress';
import { opslevelApiRef } from '../api';
import { useApi } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useAsync, useAsyncFn } from 'react-use';
import { LevelCategory, OpsLevelServiceData, ScorecardStats } from '../types/OpsLevelData';
import { SnackAlert, SnackbarProps } from './SnackAlert';
import { CheckResultsByLevel } from './CheckResultsByLevel';
import ServiceMaturitySidebar from './ServiceMaturitySidebar';
import { cloneDeep } from "lodash";

export const EntityOpsLevelMaturityContent = () => {
  const { entity } = useEntity();
  const opslevelApi = useApi(opslevelApiRef);
  const serviceAlias = stringifyEntityRef(entity);

  const [opsLevelData, setOpsLevelData] = useState<OpsLevelServiceData>();
  const [exporting, setExporting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarProps>({ message: "", severity: "info" });
  const [selectedCategories, setSelectedCategories] = useState<Array<String>>([]);
  const [fetchState, doFetch] = useAsyncFn(async () => {
    const result = await opslevelApi.getServiceMaturityByAlias(serviceAlias)

    if (result) {
      setOpsLevelData(result);
      setSelectedCategories(
        result.account.service.maturityReport.categoryBreakdown
          .filter((cb: LevelCategory) => !!cb.level)
          .map((cb: LevelCategory) => cb.category.id).concat(
            result.account.service.serviceStats.scorecards.nodes
              .filter((s: ScorecardStats) => s.scorecard?.affectsOverallServiceLevels && !!s.categories?.edges?.[0]?.level)
              .map((s: ScorecardStats) => s.categories?.edges?.[0]?.node?.id)
          )
      );
    }
  });
  useAsync(doFetch, [serviceAlias])

  if (fetchState.loading || exporting) {
    return (<>
      <SnackAlert {...snackbar} open={snackbarOpen} setOpen={setSnackbarOpen} />
      <Progress />
    </>);
  }
  if (fetchState.error) {
    return (
      <Alert severity="error">
        {fetchState.error?.message}
      </Alert>
    );
  }

  const service = opsLevelData?.account?.service;
  let opslevelUrl = "https://app.opslevel.com";
  if (service) {
    const extensionToRemove = `/services/${entity.metadata.name}`;
    opslevelUrl = service.htmlUrl.split(extensionToRemove).filter(s=>s).join(extensionToRemove)
  }

  if (!service) {
    const error = (<span>
      OpsLevel doesn't know about this service. Export it to get started.
      <br/>
      Alternatively, you can export all entities at once from&nbsp;
      <a href="/opslevel-maturity" target="_blank" style={{textDecoration: "underline"}}>the Maturity page</a>.
    </span>);

    return <ServiceMaturityError error={error} showExport />
  }

  const { maturityReport } = service;
  const levels = opsLevelData.account.rubric?.levels?.nodes;
  const levelCategories = opsLevelData.account.service.maturityReport?.categoryBreakdown.map((c) => { return { ...c, rollsUp: true }}) || [];
  const checkResultsByLevel = opsLevelData.account.service.serviceStats?.rubric?.checkResults?.byLevel?.nodes;
  const scorecards = opsLevelData.account.service.serviceStats?.scorecards?.nodes;
  const scorecardCategories = scorecards?.reduce(
    (scoreCardAccumulator: LevelCategory[], currentScorecard) => {
      if (!currentScorecard.categories?.edges) return scoreCardAccumulator;
      return [
        ...scoreCardAccumulator,
        ...currentScorecard.categories.edges.reduce(
          (nodeAccumulator: LevelCategory[], currentEdge): LevelCategory[] => [
            ...nodeAccumulator,
            {
              category: {id: currentEdge.node?.id ?? '', name: currentEdge.node?.name ?? ''},
              level: currentEdge.level?.name ? {name: currentEdge.level?.name} : null,
              rollsUp:
                  currentScorecard?.scorecard?.affectsOverallServiceLevels,
            },
          ],
          [],
        ),
      ];
    },
    [],
  ).sort((a, b) => (a.category.name < b.category.name ? -1 : 1));


  function checksByLevelIncludingScorecards() {
    if (!checkResultsByLevel) return [];
    const result = cloneDeep(checkResultsByLevel);

    result.forEach((checkResults) => {
      // Use level's 'index' field b/c we don't have level ID here. Note: 'index' *is not* the same as array index
      const levelIndex = checkResults.level.index;
      scorecards?.forEach((scorecard) => {
        const entry = scorecard.checkResults?.byLevel?.nodes?.find(
          (node) => node.level.index === levelIndex,
        );
        if (!entry) return;

        entry.items.nodes.forEach((node) => {
          node.check.isScorecardCheck = true;
        });
        checkResults.items.nodes = [
          ...checkResults.items.nodes,
          ...entry.items.nodes,
        ].filter((i) => !!i.check.category && selectedCategories.includes(i.check.category.id));
        ;
      })
    })
    return result;
  }

  const allCheckResultsByLevel = checksByLevelIncludingScorecards()

  function totalChecks() {
    return allCheckResultsByLevel?.reduce(
      (accumulator, checkByLevel) =>
        accumulator + checkByLevel.items.nodes.length,
      0,
    );
  }

  const ResultStatusEnum = Object.freeze({
    FAILED: "failed",
    PENDING: "pending",
    PASSED: "passed",
    UPCOMING_FAILED: "upcoming_failed",
    UPCOMING_PENDING: "upcoming_pending",
    UPCOMING_PASSED: "upcoming_passed",
  });

  function totalPassingChecks() {
    return allCheckResultsByLevel.reduce(
      (accumulator, checkByLevel) =>
        accumulator +
        checkByLevel.items.nodes.reduce(
          (passingChecks, check) =>
            passingChecks +
            (check.status === ResultStatusEnum.PASSED  ? 1 : 0),
          0,
        ),
      0,
    );
  }

  if (!maturityReport) {
    return (<ServiceMaturityError error={"We don't have any maturity details for this service yet,"
      + " please check back in a few minutes."}/>)
  }

  async function exportEntity(event: React.MouseEvent) {
    event.preventDefault();
    setExporting(true);

    showSnackbar({ message: "Updating service in OpsLevel...", severity: "info" });

    const result = await opslevelApi.exportEntity(entity);

    showSnackbar({ message: result?.importEntityFromBackstage.actionMessage, severity: "success", duration: 5000 });

    setExporting(false);

    doFetch();
  }

  function showSnackbar (snackbarProps: SnackbarProps) {
    setSnackbarOpen(true);
    setSnackbar({ ...snackbarProps});
  }

  function updateCategoryIdSelection(addedCategoryIds: Array<String>, removedCategoryIds: Array<String>) {
    const newSelection = selectedCategories.filter((c) => !removedCategoryIds.includes(c));
    addedCategoryIds.forEach((id) => {
      if(!newSelection.includes(id)) newSelection.push(id);
    });
    setSelectedCategories(newSelection);
  }

  const overallLevel = (() => {
    const sortedLevels = levels.sort((a, b) => (a.index > b.index) ? 1 : -1);
    const sortedCheckResults = allCheckResultsByLevel.sort((a, b) => (a.level.index > b.level.index) ? 1 : -1);

    let i;
    for(i = 0; i < sortedCheckResults.length; i++) {
      if(sortedCheckResults[i].items.nodes.some((e) => e.status === "failed" || e.status === "pending")) {
        return sortedLevels[i];
      }
    }
    return sortedLevels[i];
  })();

  function ServiceMaturityError ({ error, showExport }: { error: React.ReactNode, showExport?: boolean }) {
    return (<Grid container direction="column" spacing={5}>
      <SnackAlert  {...snackbar} open={snackbarOpen} setOpen={setSnackbarOpen} />
      <Grid item>{error}</Grid>
      <Grid item>
        { showExport ?
          <Button
            variant="contained"
            color="primary"
            onClick={exportEntity}
            disabled={exporting}
          >
          Export Entity to OpsLevel
          </Button> :
          <Button
            variant="contained"
            color="primary"
            target="_blank"
            href={`${service?.htmlUrl}/maturity-report`}
          >
          View Maturity in OpsLevel
          </Button>
        }
      </Grid>
    </Grid>
    )
  }

  function ServiceMaturityReport () {
    return (<>
      <Grid container item xs={12} justifyContent="flex-end" direction="row">
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={exportEntity}
            disabled={exporting}
          >
            Update Entity
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            target="_blank"
            href={`${service?.htmlUrl}/maturity-report`}
          >
            View Maturity in OpsLevel
          </Button>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={4}>
          {maturityReport?.overallLevel && 
              <ServiceMaturitySidebar 
                levels={levels} 
                scorecardCategories={scorecardCategories}
                levelCategories={levelCategories} 
                overallLevel={maturityReport.overallLevel}
                selectedCategoryIds={selectedCategories}
                onCategorySelectionChanged={updateCategoryIdSelection}
              />
          }
        </Grid>
        <Grid container item xs={8} direction="column">
          <Grid item>
            <EntityOpsLevelMaturityProgress
              levels={levels}
              serviceLevel={overallLevel}
            />
          </Grid>
          <Grid item>
            <CheckResultsByLevel
              opslevelUrl={opslevelUrl}
              checkResultsByLevel={allCheckResultsByLevel}
              totalChecks={totalChecks()}
              totalPassingChecks={totalPassingChecks()}
            />
          </Grid>
        </Grid>
      </Grid>
    </>);
  }

  return (
    <Grid container spacing={2} direction="column">
      <SnackAlert  {...snackbar} open={snackbarOpen} setOpen={setSnackbarOpen} />
      <ServiceMaturityReport />
    </Grid>
  );
};
