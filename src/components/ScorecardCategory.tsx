import React, { useCallback } from "react";
import { Grid, ListItem, ListItemText, Tooltip, makeStyles } from '@material-ui/core';
import { Level, LevelCategory } from "../types/OpsLevelData";
import { levelColor } from "../helpers/level_color_helper";
import { PieChartOutlined } from "@ant-design/icons";

type Props = {
  levels: Array<Level>;
  levelCategory: LevelCategory
};

const colorGrey = '#e9e9e9';

const useStyles = makeStyles(() => {
  return {
    root: {
      '&:first-of-type': {
        borderTop: `1px solid ${colorGrey}`,
      },
      borderBottom: `1px solid ${colorGrey}`,
    },
    levelWrapper: {
      display: 'flex',
      verticalAlign: 'middle',
      marginTop:'auto',
      marginBottom:'auto',
    },
    level: {
      flexGrow: 1,
      border: `1px solid ${colorGrey}`,
      display: 'inline-block',
      height: '8px',
    },
  };
});

function ScorecardCategory({levelCategory, levels}: Props) {
  const classes = useStyles();

  const getLevelColor = useCallback((levelIndexToCheck: number) => {
    if (!levelCategory.level) {
      return '#d9d9d9';
    }
    const levelName = levelCategory.level.name;
    const categoryLevelIndex = levels.findIndex((levelToCheck) => levelToCheck.name === levelName);
    if (categoryLevelIndex < levelIndexToCheck) {
      return '#d9d9d9';
    }
    return levelColor(levels.length, levels.findIndex((levelToCheck) => levelToCheck.name === levelName)).secondary;
  }, [levelCategory, levels])

  return (
    <ListItem className={classes.root} disabled={!levelCategory.level} dense>
      <ListItemText>
        <Grid container>
          <Grid item xs={8}>
            {levelCategory.category.name}
          </Grid>
          <Grid item xs={3} className={classes.levelWrapper} aria-label="level">
            {levels.map((level) => (<span key={level.index} className={classes.level} style={{backgroundColor: getLevelColor(levels.indexOf(level))}} />))}
          </Grid>
          <Grid item xs={1}>
            <Tooltip title="These checks affect your service's maturity level.">
              <PieChartOutlined alt="icon indicating that this category contributes to overall maturity level"/>
            </Tooltip>
          </Grid>
        </Grid>
      </ListItemText>
    </ListItem>
  );
}

export default ScorecardCategory;
