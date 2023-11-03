import React, { useCallback } from "react";
import { Grid, ListItem, ListItemText, Tooltip, makeStyles } from '@material-ui/core';
import { Level, LevelCategory } from "../types/OpsLevelData";
import { levelColor } from "../helpers/level_color_helper";
import { PieChartOutlined } from "@ant-design/icons";
import  clsx  from "clsx";
import Checkbox from '@mui/material/Checkbox';
import { BackstageTheme } from '@backstage/theme';


type Props = {
  levels: Array<Level>;
  levelCategory: LevelCategory;
  checked: boolean | null;
  onCheckedChange: Function;
};

const colorGrey = '#e9e9e9';
const colorDisabled = '#d9d9d9';

const useStyles = makeStyles((theme: BackstageTheme) => {
  return {
    root: {
      '&:first-of-type': {
        borderTop: `1px solid ${colorGrey}`,
      },
      borderBottom: `1px solid ${colorGrey}`,
      cursor: "pointer",
      '&:hover': {
        backgroundColor: theme.palette.background.default
      },
      "&.Mui-disabled": {
        cursor: "not-allowed"
      }
    },
    categoryName: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      paddingRight: '12px',
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
      transform: "translateY(-1px)",
      marginRight: "4px"
    },
    tooltip: {
      fontSize: theme.typography.button.fontSize,
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
  const isChecked = (checked && !isDisabled) || undefined;

  const toggleChecked = () => {
    onCheckedChange(!isChecked);
  }

  return (
    <ListItem className={classes.root} disabled={isDisabled} dense onClick={toggleChecked}>
      <ListItemText>
        <Grid container spacing={0}>
          <Grid item xs={2} lg={1}>
            <Checkbox
              data-testid={`checkbox-${levelCategory.category.id}`}
              disabled={isDisabled}
              className={classes.scorecardCheckbox}
              checked={isChecked}
            />
          </Grid>
          <Grid item xs={10} lg={6} className={classes.categoryName}>
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
