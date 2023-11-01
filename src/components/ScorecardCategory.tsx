import React, { useCallback } from "react";
import { Grid, ListItem, ListItemText, Tooltip, makeStyles } from '@material-ui/core';
import { Level, LevelCategory } from "../types/OpsLevelData";
import { levelColor } from "../helpers/level_color_helper";
import { PieChartOutlined } from "@ant-design/icons";
import  clsx  from "clsx";

type Props = {
  levels: Array<Level>;
  levelCategory: LevelCategory
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
  };
});

function ScorecardCategory({levelCategory, levels}: Props) {
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

  return (
    <Tooltip title={isDisabled ? "There are no checks in this category that apply to this service" : ''}>
      <ListItem className={classes.root} disabled={isDisabled} dense>
        <ListItemText>
          <Grid container>
            <Grid item xs={8}>
              {levelCategory.category.name}
            </Grid>
            <Grid item xs={4} aria-label="level">
              <Tooltip title={levelCategory.level?.name ?? ""}>
                <Grid className={classes.levelWrapper} container>
                  {levels.map((level) => (<span key={level.index} className={clsx(classes.level, isDisabled ? classes.levelDisabled : '')} style={{backgroundColor: getLevelColor(levels.indexOf(level))}} />))}
                </Grid>
              </Tooltip>
              <Tooltip title={isDisabled ? '' : "These checks affect your service's maturity level."}>
                <PieChartOutlined alt="icon indicating that this category contributes to overall maturity level"/>
              </Tooltip>
            </Grid>
          </Grid>
        </ListItemText>
      </ListItem>
    </Tooltip>
  );
}

export default ScorecardCategory;
