import React from "react";
import { Button, Grid } from "@material-ui/core";
import Campaigns from "./Campaigns/Campaigns";
import EntityOpsLevelMaturityProgress from "./EntityOpsLevelMaturityProgress";
import CheckResultsByLevel from "./CheckResultsByLevel/CheckResultsByLevel";
import ServiceMaturitySidebar from "./ServiceMaturitySidebar";
import {
  LevelCategory,
  LevelCheckResults,
  LevelNode,
  OpsLevelService,
  OverallLevel,
  ScorecardStats,
} from "../../../types/OpsLevelData";
import checksByLevelIncludingScorecards from "../../../helpers/checksByLevelIncludingScorecards";

type Props = {
  onExportEntity: (event: React.MouseEvent) => void;
  exporting: boolean;
  levels: LevelNode[];
  service: OpsLevelService;
  checkResultsByLevel: LevelCheckResults[] | undefined;
  selectedCategories: string[];
  scorecards: ScorecardStats[] | undefined;
  overallLevel?: OverallLevel;
  onCategorySelectionChange: (selectedCategories: string[]) => void;
};

export default function ServiceMaturityReport({
  onExportEntity,
  exporting,
  levels,
  service,
  checkResultsByLevel,
  selectedCategories,
  scorecards,
  overallLevel,
  onCategorySelectionChange,
}: Props) {
  const levelCategories =
    service.maturityReport?.categoryBreakdown.map((c) => {
      return { ...c, rollsUp: true };
    }) || [];

  const allCheckResultsByLevel = checksByLevelIncludingScorecards(
    selectedCategories,
    checkResultsByLevel,
    scorecards,
  );

  const serviceLevel = (() => {
    const sortedLevels = levels.sort((a, b) => (a.index > b.index ? 1 : -1));
    const sortedCheckResults = allCheckResultsByLevel.sort((a, b) =>
      a.level.index > b.level.index ? 1 : -1,
    );

    let i;
    for (i = 0; i < sortedCheckResults.length; i++) {
      if (
        sortedCheckResults[i].items.nodes.some(
          (e) => e.status === "failed" || e.status === "pending",
        )
      ) {
        return sortedLevels[i];
      }
    }
    return sortedLevels[i];
  })();

  const ResultStatusEnum = Object.freeze({
    FAILED: "failed",
    PENDING: "pending",
    PASSED: "passed",
    UPCOMING_FAILED: "upcoming_failed",
    UPCOMING_PENDING: "upcoming_pending",
    UPCOMING_PASSED: "upcoming_passed",
  });

  function totalChecks() {
    return allCheckResultsByLevel?.reduce(
      (accumulator, checkByLevel) =>
        accumulator + checkByLevel.items.nodes.length,
      0,
    );
  }

  function totalPassingChecks() {
    return allCheckResultsByLevel.reduce(
      (accumulator, checkByLevel) =>
        accumulator +
        checkByLevel.items.nodes.reduce(
          (passingChecks, check) =>
            passingChecks + (check.status === ResultStatusEnum.PASSED ? 1 : 0),
          0,
        ),
      0,
    );
  }

  const scorecardCategories = scorecards
    ?.reduce((scoreCardAccumulator: LevelCategory[], currentScorecard) => {
      if (!currentScorecard.categories?.edges) {
        return scoreCardAccumulator;
      }
      return [
        ...scoreCardAccumulator,
        ...currentScorecard.categories.edges.reduce(
          (nodeAccumulator: LevelCategory[], currentEdge): LevelCategory[] => [
            ...nodeAccumulator,
            {
              category: {
                id: currentEdge.node?.id ?? "",
                name: currentEdge.node?.name ?? "",
              },
              level: currentEdge.level?.name
                ? { name: currentEdge.level?.name }
                : null,
              rollsUp: currentScorecard?.scorecard?.affectsOverallServiceLevels,
            },
          ],
          [],
        ),
      ];
    }, [])
    .sort((a, b) => (a.category.name < b.category.name ? -1 : 1));

  function updateCategoryIdSelection(
    addedCategoryIds: string[],
    removedCategoryIds: string[],
  ) {
    const newSelection = selectedCategories.filter(
      (c) => !removedCategoryIds.includes(c),
    );
    addedCategoryIds.forEach((id) => {
      if (!newSelection.includes(id)) {
        newSelection.push(id);
      }
    });
    onCategorySelectionChange(newSelection);
  }

  return (
    <>
      <Grid container item xs={12} justifyContent="flex-end" direction="row">
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={onExportEntity}
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
            href={`${service.htmlUrl}/maturity-report`}
          >
            View Maturity in OpsLevel
          </Button>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item container xs={4}>
          {overallLevel && (
            <Grid item xs={12}>
              <ServiceMaturitySidebar
                levels={levels}
                scorecardCategories={scorecardCategories}
                levelCategories={levelCategories}
                overallLevel={overallLevel}
                selectedCategoryIds={selectedCategories}
                onCategorySelectionChanged={updateCategoryIdSelection}
              />
            </Grid>
          )}
          {service && (
            <Grid item xs={12}>
              {" "}
              <Campaigns serviceId={service.id} />
            </Grid>
          )}
        </Grid>
        <Grid container item xs={8} direction="column">
          <Grid item>
            <EntityOpsLevelMaturityProgress
              levels={levels}
              serviceLevel={serviceLevel}
            />
          </Grid>
          <Grid item>
            <CheckResultsByLevel
              checkResultsByLevel={allCheckResultsByLevel}
              totalChecks={totalChecks()}
              totalPassingChecks={totalPassingChecks()}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
