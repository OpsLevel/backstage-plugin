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

  return (
    <ListItem className={classes.root} disabled={!levelCategory.level} dense>
      <ListItemText>
        <Grid container>
          <Grid item xs={8}>
            {levelCategory.category.name}
          </Grid>
          <Tooltip title={levelCategory.level?.name ?? ""}>
            <Grid item xs={3} className={classes.levelWrapper} aria-label="level">
              <>
                {levels.map((level) => (<span key={level.index} className={clsx(classes.level, !levelCategory.level ? classes.levelDisabled : '')} style={{backgroundColor: getLevelColor(levels.indexOf(level))}} />))}
              </>
            </Grid>
          </Tooltip>
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
