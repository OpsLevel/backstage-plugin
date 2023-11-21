import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import { stringifyEntityRef } from "@backstage/catalog-model";
import { Progress } from "@backstage/core-components";
import Alert from "@material-ui/lab/Alert";
import { useApi } from "@backstage/core-plugin-api";
import { useEntity } from "@backstage/plugin-catalog-react";
import { useAsync, useAsyncFn } from "react-use";
import ServiceMaturityError from "./ServiceMaturityError";
import { opslevelApiRef } from "../api";
import ServiceMaturityReport from "./ServiceMaturityReport";
import {
  LevelCategory,
  OpsLevelServiceData,
  ScorecardStats,
} from "../types/OpsLevelData";
import { SnackAlert, SnackbarProps } from "./SnackAlert";

// eslint-disable-next-line import/prefer-default-export -- One of the top level exports
export function EntityOpsLevelMaturityContent() {
  const { entity } = useEntity();
  const opslevelApi = useApi(opslevelApiRef);
  const serviceAlias = stringifyEntityRef(entity);

  const [opsLevelData, setOpsLevelData] = useState<OpsLevelServiceData>();
  const [exporting, setExporting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    message: "",
    severity: "info",
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [fetchState, doFetch] = useAsyncFn(async () => {
    const result = await opslevelApi.getServiceMaturityByAlias(serviceAlias);

    if (result) {
      setOpsLevelData(result);
      setSelectedCategories(
        result.account.service.maturityReport.categoryBreakdown
          .filter((cb: LevelCategory) => !!cb.level)
          .map((cb: LevelCategory) => cb.category.id)
          .concat(
            result.account.service.serviceStats.scorecards.nodes
              .filter(
                (s: ScorecardStats) =>
                  s.scorecard?.affectsOverallServiceLevels &&
                  !!s.categories?.edges?.[0]?.level,
              )
              .map((s: ScorecardStats) => s.categories?.edges?.[0]?.node?.id),
          ),
      );
    }
  });
  useAsync(doFetch, [serviceAlias]);

  if (fetchState.loading || exporting) {
    return (
      <>
        <SnackAlert
          {...snackbar}
          open={snackbarOpen}
          setOpen={setSnackbarOpen}
        />
        <Progress />
      </>
    );
  }
  if (fetchState.error) {
    return <Alert severity="error">{fetchState.error?.message}</Alert>;
  }

  function showSnackbar(snackbarProps: SnackbarProps) {
    setSnackbarOpen(true);
    setSnackbar({ ...snackbarProps });
  }

  async function exportEntity(event: React.MouseEvent) {
    event.preventDefault();
    setExporting(true);

    showSnackbar({
      message: "Updating service in OpsLevel...",
      severity: "info",
    });

    const result = await opslevelApi.exportEntity(entity);

    showSnackbar({
      message: result?.importEntityFromBackstage.actionMessage,
      severity: "success",
      duration: 5000,
    });

    setExporting(false);

    doFetch();
  }

  const service = opsLevelData?.account?.service;
  if (!service) {
    const error = (
      <span>
        OpsLevel doesn't know about this service. Export it to get started.
        <br />
        Alternatively, you can export all entities at once from&nbsp;
        <a
          href="/opslevel-maturity"
          target="_blank"
          style={{ textDecoration: "underline" }}
        >
          the Maturity page
        </a>
        .
      </span>
    );

    return (
      <Grid container direction="column" spacing={5}>
        <SnackAlert
          {...snackbar}
          open={snackbarOpen}
          setOpen={setSnackbarOpen}
        />
        <ServiceMaturityError
          error={error}
          showExport
          exportEntity={exportEntity}
          exporting={exporting}
        />
      </Grid>
    );
  }

  const { maturityReport } = service;
  const levels = opsLevelData.account.rubric.levels.nodes;
  const checkResultsByLevel =
    opsLevelData.account.service.serviceStats?.rubric?.checkResults?.byLevel
      ?.nodes;
  const scorecards =
    opsLevelData.account.service.serviceStats?.scorecards?.nodes;

  if (!maturityReport) {
    return (
      <Grid container direction="column" spacing={5}>
        <SnackAlert
          {...snackbar}
          open={snackbarOpen}
          setOpen={setSnackbarOpen}
        />
        <ServiceMaturityError
          exportEntity={exportEntity}
          exporting={exporting}
          serviceUrl={service.htmlUrl}
          error="We don't have any maturity details for this service yet, please check back in a few minutes."
        />
      </Grid>
    );
  }

  return (
    <Grid container spacing={2} direction="column">
      <SnackAlert {...snackbar} open={snackbarOpen} setOpen={setSnackbarOpen} />
      <ServiceMaturityReport
        exportEntity={exportEntity}
        exporting={exporting}
        levels={levels}
        service={service}
        checkResultsByLevel={checkResultsByLevel}
        selectedCategories={selectedCategories}
        scorecards={scorecards}
        overallLevel={maturityReport?.overallLevel}
        onCategorySelectionChange={setSelectedCategories}
      />
    </Grid>
  );
}
