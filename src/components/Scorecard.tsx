import React, { useMemo } from "react";
import { LevelCategory, Level } from "../types/OpsLevelData";
import List from '@mui/material/List';
import ScorecardCategory from "./ScorecardCategory";

type Props = {
  title: string;
  levels: Array<Level>;
  levelCategories?:
    Array<LevelCategory>
};

function Scorecard({levelCategories, levels, title}: Props) {
  const sortedLevels= useMemo(()=>[...levels].sort(
    (a: Level, b: Level) => a.index - b.index
  ), [levels]);

  return (
    <>
      <List
        component="nav"
        subheader={
          <h4>{title}</h4>
        }
      >
        {levelCategories && levelCategories.map(levelCategory => (
          <ScorecardCategory key={levelCategory.category.name} levelCategory={levelCategory} levels={sortedLevels} />
        ))}
      </List>
    </>
  );
}

export default Scorecard;
