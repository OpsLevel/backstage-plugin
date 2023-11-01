import React, { useMemo } from "react";
import { LevelCategory, Level } from "../types/OpsLevelData";
import List from '@mui/material/List';
import ScorecardCategory from "./ScorecardCategory";

type Props = {
  levels: Array<Level>;
  levelCategories?:
    Array<LevelCategory>
};

function Scorecard({levelCategories, levels}: Props) {
  const sortedLevels= useMemo(()=>[...levels].sort(
    (a: Level, b: Level) => a.index - b.index
  ), [levels]);
  if (!levelCategories) {
    return null;
  }

  return (
    <>
      <List
        component="nav"
        subheader={
          <h4>
          Rubric
          </h4>
        }
      >
        {levelCategories.map(levelCategory => (
          <ScorecardCategory key={levelCategory.category.name} levelCategory={levelCategory} levels={sortedLevels} />
        ))}
      </List>
    </>
  );
}

export default Scorecard;
