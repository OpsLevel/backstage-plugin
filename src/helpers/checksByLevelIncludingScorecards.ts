import { cloneDeep } from "lodash";
import { LevelCheckResults, ScorecardStats } from "../types/OpsLevelData";

export default function checksByLevelIncludingScorecards(
  selectedCategories: string[],
  checkResultsByLevel?: LevelCheckResults[],
  scorecards?: ScorecardStats[],
) {
  if (!checkResultsByLevel) {
    return [];
  }
  const result = cloneDeep(checkResultsByLevel);

  result.forEach((checkResults) => {
    // Use level's 'index' field b/c we don't have level ID here. Note: 'index' *is not* the same as array index
    const levelIndex = checkResults.level.index;
    scorecards?.forEach((scorecard) => {
      const entry = scorecard.checkResults?.byLevel?.nodes?.find(
        (node) => node.level.index === levelIndex,
      );
      if (!entry) {
        return;
      }

      entry.items.nodes.forEach((node) => {
        // eslint-disable-next-line no-param-reassign -- This is taken from OpsLevel and keeping them in sync should be prioritized
        node.check.isScorecardCheck = true;
      });
      // eslint-disable-next-line no-param-reassign -- This is taken from OpsLevel and keeping them in sync should be prioritized
      checkResults.items.nodes = [
        ...checkResults.items.nodes,
        ...entry.items.nodes,
      ];
    });

    // eslint-disable-next-line no-param-reassign -- This is taken from OpsLevel and keeping them in sync should be prioritized
    checkResults.items.nodes = checkResults.items.nodes.filter(
      (i) =>
        !!i.check.category && selectedCategories.includes(i.check.category.id),
    );
  });
  return result;
}
