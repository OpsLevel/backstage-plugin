import React from 'react';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import { BackstageTheme } from '@backstage/theme';
import { Box, LinearProgress, Tooltip, makeStyles } from '@material-ui/core';
import { InfoCard } from '@backstage/core-components';
// import { CheckResultsByLevel } from './CheckResultsByLevel';

const useStyles = makeStyles((theme: BackstageTheme) => ({
  progressBar: {
    backgroundColor: theme.palette.success.main,
  },
  achieved: {
    color: theme.palette.success.main,
  },
  notAchieved: {
    color: 'gray',
  },
}));

function determineProgress(level: any, serviceLevelIndex: number) {
  if (level.index < serviceLevelIndex) return 100;
  if (level.index === serviceLevelIndex) return 50;
  return 0;
}

export function EntityOpsLevelMaturityProgress({ levels, serviceLevel, checkResultsByLevel }: { levels: any, serviceLevel: any, checkResultsByLevel: any }) {
  const classes = useStyles();

  const levelComponents = levels.map((level: any, index: number) => {
    const progress = determineProgress(level, serviceLevel.index);
    const last = index === levels.length - 1;
    const achieved = progress !== 0;

    const levelIcon = (
      <div className={achieved ? classes.achieved : classes.notAchieved}>
        {achieved ? (
          <CheckCircleOutlineIcon color="inherit" />
        ) : (
          <RadioButtonUncheckedIcon color="inherit" />
        )}
      </div>
    );

    const progressComponent = (
      <div style={{ width: '100%', marginTop: '20px' }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          classes={{
            bar1Determinate: classes.progressBar,
          }}
        />
      </div>
    );

    return (
      <React.Fragment key={index}>
        <Tooltip
          title={level.description}
          placement="top"
          style={{
            flexGrow: 1,
            margin: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div>
            {levelIcon}
            <span
              style={{
                textAlign: 'center',
                position: 'absolute',
                marginTop: '30px',
                width: '120px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {level.name}
            </span>
          </div>
        </Tooltip>
        {last ? null : progressComponent}
      </React.Fragment>
    );
  });

  return (
    <InfoCard title="Progress">
      <Box
        style={{
          display: 'inline-flex',
          alignItems: 'start',
          justifyContent: 'space-between',
          width: '100%',
          minHeight: '90px',
        }}
      >
        {levelComponents}
      </Box>
    </InfoCard>
  );
}
