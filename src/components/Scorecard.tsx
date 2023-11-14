import React, { useMemo, useEffect, useState } from "react";
import List from "@mui/material/List";
import Checkbox from "@mui/material/Checkbox";
import { makeStyles } from "@material-ui/core";
import ScorecardCategory from "./ScorecardCategory";
import { LevelCategory, Level } from "../types/OpsLevelData";

type Props = {
  title: string;
  levels: Array<Level>;
  levelCategories: Array<LevelCategory>;
  selectedCategoryIds: string[];
  onCategorySelectionChanged: (
    addedIds: string[],
    removedIds: string[],
  ) => void;
};

const useStyles = makeStyles(() => {
  return {
    checkbox: {
      width: "10px",
      height: "10px",
      transform: "translateY(-2px)",
      marginRight: "4px",
    },
  };
});

export default function Scorecard({
  levelCategories,
  levels,
  title,
  selectedCategoryIds,
  onCategorySelectionChanged,
}: Props) {
  const classes = useStyles();
  const sortedLevels = useMemo(
    () =>
      [...levels].sort((a: Level, b: Level) => {
        return (a.index || 0) - (b.index || 0);
      }),
    [levels],
  );

  const [checkboxValue, setCheckboxValue] = useState<boolean | null>(false);

  useEffect(() => {
    let someSelected = false;
    let someUnselected = false;
    levelCategories.forEach((c) => {
      if (!c.level) {
        return;
      }

      if (selectedCategoryIds.includes(c.category.id)) {
        someSelected = true;
      }
      if (!selectedCategoryIds.includes(c.category.id)) {
        someUnselected = true;
      }
    });
    let val: boolean | null = false;
    if (someSelected && !someUnselected) {
      val = true;
    }
    if (someSelected && someUnselected) {
      val = null;
    }
    setCheckboxValue(val);
  }, [levelCategories, selectedCategoryIds]);

  function toggleEntireScorecard() {
    if (checkboxValue === null || checkboxValue === false) {
      onCategorySelectionChanged(
        levelCategories.map((c) => c.category.id),
        [],
      );
    } else {
      onCategorySelectionChanged(
        [],
        levelCategories.map((c) => c.category.id),
      );
    }
  }

  return (
    <List
      component="nav"
      subheader={
        <span>
          <h4>
            <Checkbox
              data-testid={`category-checkbox-${title}`}
              className={classes.checkbox}
              checked={checkboxValue || false}
              indeterminate={checkboxValue === null}
              onChange={toggleEntireScorecard}
            />{" "}
            {title}
          </h4>
        </span>
      }
    >
      {levelCategories &&
        levelCategories.map((levelCategory) => (
          <ScorecardCategory
            key={levelCategory.category.id}
            levelCategory={levelCategory}
            levels={sortedLevels}
            checked={selectedCategoryIds?.includes(levelCategory.category.id)}
            onCheckedChange={(val: boolean) =>
              onCategorySelectionChanged(
                val ? [levelCategory.category.id] : [],
                val ? [] : [levelCategory.category.id],
              )
            }
          />
        ))}
    </List>
  );
}
