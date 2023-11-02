import React, { useCallback } from "react";
import { Grid, ListItem, ListItemText, Tooltip, makeStyles } from '@material-ui/core';
import { Level, LevelCategory } from "../types/OpsLevelData";
import { levelColor } from "../helpers/level_color_helper";
import { PieChartOutlined } from "@ant-design/icons";
import  clsx  from "clsx";
import Checkbox from '@mui/material/Checkbox';


type Props = {
  levels: Array<Level>;
  levelCategory: LevelCategory;
  checked: boolean | null;
  onCheckedChange: Function;
};

const colorGrey = '#e9e9e9';
const colorDisabled = '#d9d9d9';

const useStyles = makeStyles(() => {
  return {
    root: {
      '&:first-of-type': {
        borderTop: `1px solid ${colorGrey}`,
      },
      borderBottom: `1px solid ${colorGrey}`,
    },
    categoryName: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    levelWrapper: {
      display: 'inline-flex',
      verticalAlign: 'middle',
      marginTop:'auto',
      marginBottom:'auto',
      paddingRight: '14px',
      width: '100%',
    },
    level: {
      flexGrow: 1,
      border: `1px solid ${colorGrey}`,
      display: 'inline-block',
      height: '8px',
    },
    levelDisabled: {
      border: `1px solid ${colorDisabled}`,
    },
    scorecardCheckbox: {
      width: "10px",
      height: "10px",
      transform: "translateY(-1px)"
    },
    tooltip: {
      fontSize: "12pt",
    },
  };
});

function ScorecardCategory({levelCategory, levels, checked, onCheckedChange}: Props) {
  const classes = useStyles();

  const getLevelColor = useCallback((levelIndexToCheck: number) => {
    if (!levelCategory.level) {
      return colorDisabled;
    }
    const levelName = levelCategory.level.name;
    const categoryLevelIndex = levels.findIndex((levelToCheck) => levelToCheck.name === levelName);
    if (categoryLevelIndex < levelIndexToCheck) {
      return colorDisabled;
    }
    return levelColor(levels.length, levels.findIndex((levelToCheck) => levelToCheck.name === levelName)).secondary;
  }, [levelCategory, levels])

  const isDisabled = !levelCategory.level;
  const disabledTooltipMessage = "There are no checks in this category that apply to this service";

  return (
    <ListItem className={classes.root} disabled={isDisabled} dense>
      <ListItemText>
        <Grid container spacing={0}>
          <Grid item xs={3} lg={1}>
            <Checkbox
              data-testid={`checkbox-${levelCategory.category.id}`}
              disabled={isDisabled}
              className={classes.scorecardCheckbox}
              checked={(checked && !isDisabled) || undefined}
              style={{width: "10px", height: "10px", transform: "translateY(-2px)", marginRight: "4px" }}
              onChange={(e) => onCheckedChange(e.target.checked)}
            />
          </Grid>
          <Grid item xs={9} lg={6} className={classes.categoryName}>
            {levelCategory.category.name}
          </Grid>
          <Grid item xs={12} lg={5}>
            <Tooltip classes={{tooltip: classes.tooltip}} title={isDisabled ? disabledTooltipMessage : (levelCategory.level?.name ?? "")}>
              <Grid className={classes.levelWrapper} container aria-label="level">
                {levels.map((level) => (<span key={level.index} className={clsx(classes.level, isDisabled ? classes.levelDisabled : '')} style={{backgroundColor: getLevelColor(levels.indexOf(level))}} />))}
              </Grid>
            </Tooltip>
            {levelCategory.rollsUp && <Tooltip classes={{tooltip: classes.tooltip}} title={isDisabled ? disabledTooltipMessage : "These checks affect your service's maturity level."}>
              <PieChartOutlined alt="icon indicating that this category contributes to overall maturity level"/>
            </Tooltip>}
          </Grid>
        </Grid>
      </ListItemText>
    </ListItem>
  );
}

export default ScorecardCategory;
