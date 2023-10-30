import React from "react";
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

function ServiceMaturitySidebar({levels, levelCategories, overallLevel}: Props) {
  return (
    <InfoCard title="Service Maturity">
      <CurrentLevel overallLevel={overallLevel} />
      <Scorecard levels={levels} levelCategories={levelCategories} />
    </InfoCard>
  );
}

export default ServiceMaturitySidebar;
