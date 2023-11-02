import React, { useMemo } from "react";
import { LevelCategory, Level } from "../types/OpsLevelData";
import List from '@mui/material/List';
import ScorecardCategory from "./ScorecardCategory";
import { useState } from "react";
import Checkbox from '@mui/material/Checkbox';

type Props = {
  title: string;
  levels: Array<Level>;
  levelCategories?:
    Array<LevelCategory>
};

function checkboxState(levelCategories, selectedCategoryIds) {
  let someSelected = false;
  let someUnselected = false;
  levelCategories.forEach((c) => {
    if(!c.level) return;

    if(selectedCategoryIds.includes(c.category.id)) someSelected = true;
    if(!selectedCategoryIds.includes(c.category.id)) someUnselected = true;
  });
  if(someSelected && !someUnselected) return true;
  if(someSelected && someUnselected) return null;
  return false;
}

function toggleEntireScorecard(currentState, levelCategories, onCategorySelectionChanged) {
  if(currentState == null || currentState == false) {
    onCategorySelectionChanged(levelCategories.map((c) => c.category.id), []);
  } else {
    onCategorySelectionChanged([], levelCategories.map((c) => c.category.id));
  }
}

function Scorecard({levelCategories, levels, title, selectedCategoryIds, onCategorySelectionChanged}: Props) {
  const sortedLevels= useMemo(()=>[...levels].sort(
    (a: Level, b: Level) =>{
      return (a.index || 0) - (b.index || 0);
    }), [levels]);
  const checkboxValue = checkboxState(levelCategories, selectedCategoryIds);
  return (
    <>
      <List
        component="nav"
        subheader={
          <span>
            <h4><Checkbox
                  style={{width: "10px", height: "10px", transform: "translateY(-2px)", marginRight: "4px" }}
                  checked={checkboxValue}
                  indeterminate={checkboxValue == null}
                  onChange={() => {toggleEntireScorecard(checkboxValue, levelCategories, onCategorySelectionChanged)}}
                /> {title}</h4>
          </span>
        }
      >
        {levelCategories && levelCategories.map(levelCategory => (
          <ScorecardCategory
            key={levelCategory.category.id}
            levelCategory={levelCategory}
            levels={sortedLevels}
            checked={ selectedCategoryIds?.includes(levelCategory.category.id) }
            onCheckedChange={ (e) => onCategorySelectionChanged(e ? [levelCategory.category.id] : [], e ? [] : [levelCategory.category.id]) }
          />
        ))}
      </List>
    </>
  );
}

export default Scorecard;
