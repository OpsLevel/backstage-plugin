import React from "react";
import { makeStyles } from '@material-ui/core';
import { BackstageTheme } from '@backstage/theme';
import { InfoCard } from "@backstage/core-components";
import { LevelCategory, OverallLevel } from "../types/OpsLevelData";
import Scorecard from "./Scorecard";
import { CurrentLevel } from "./CurrentLevel";

type Level = {
  index: number;
  name: string;
};

type Props = {
  levels: Array<Level>;
  levelCategories:
    | Array<LevelCategory>
    | undefined,
  overallLevel: OverallLevel,
};

const useStyles = makeStyles((theme: BackstageTheme) => ({
  currentLevel: {
    marginBottom: theme.spacing(4),
  }
}));

function ServiceMaturitySidebar({levels, levelCategories, overallLevel}: Props) {
  const classes = useStyles();
  return (
    <InfoCard title="Service Maturity">
      <div className={classes.currentLevel}>
        <CurrentLevel overallLevel={overallLevel} />
      </div>
      <Scorecard levels={levels} levelCategories={levelCategories} />
    </InfoCard>
  );
}

export default ServiceMaturitySidebar;
