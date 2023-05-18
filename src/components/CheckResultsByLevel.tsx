import { InfoCard } from '@backstage/core-components';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { CheckResultDetails } from './CheckResultDetails';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import CancelIcon from '@material-ui/icons/Cancel';
import ErrorIcon from '@material-ui/icons/Error';
import cloneDeep from 'lodash/cloneDeep';
import React, { useState, useRef, SyntheticEvent } from 'react';
import { CheckResult, LevelCheckResults } from '../types/OpsLevelData';
import { makeStyles } from '@material-ui/core';
import { BackstageTheme } from '@backstage/theme';


type Props = {
  checkResultsByLevel: Array<LevelCheckResults>,
  totalChecks: number,
  totalPassingChecks: number
}

const useStyles = makeStyles((theme: BackstageTheme) => {
  return {
    accordion: {
      backgroundColor: `${theme.palette.background.default} !important`,
    },
    accordionSummary: {
      backgroundColor: `${theme.palette.background.default} !important`,
      borderRadius: "5px !important",
      color: `${theme.palette.text.primary} !important`,
    },
    accordionDetails: {
      backgroundColor: theme.palette.background.paper,
    },
    coloredText: {
      color: `${theme.palette.text.primary} !important`,
    },
    coloredSubtext: {
      color: `${theme.palette.text.secondary} !important`,
    },
  };
});

export function CheckResultsByLevel({ checkResultsByLevel, totalChecks, totalPassingChecks }: Props) {
  const [checkResults, setCheckResults] = useState<Array<LevelCheckResults>>([]);
  const [levelCounts, setLevelCounts] = useState<{ [index: number]: Array<number> }>({});
  const [expandedLevels, setExpandedLevels] = useState<{ [index: number]: boolean }>({});
  const prevCheckResults = usePrevious(checkResults);
  const styles = useStyles();

  function usePrevious(value: Array<LevelCheckResults>) {
    const ref = useRef<Array<LevelCheckResults>>();
    React.useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  React.useEffect(() => {
    function getLevelCounts(itemCheckResults: Array<CheckResult>) {
      let passCount = 0;
      let failCount = 0;
      let upcomingPassedCount = 0;
      let pendingCount = 0;
      let upcomingFailedCount = 0;
      let upcomingPendingCount = 0;
      for(const i in itemCheckResults) {
        if ({}.hasOwnProperty.call(itemCheckResults, i)) {
          const combinedStatus = getCombinedStatus(itemCheckResults[i]);
          if(combinedStatus === "passed") passCount++;
          else if(combinedStatus === "failed") failCount++;
          else if(combinedStatus === "pending") pendingCount++;
          else if(combinedStatus === "upcoming_failed") upcomingFailedCount++;
          else if(combinedStatus === "upcoming_pending") upcomingPendingCount++;
          else if(combinedStatus === "upcoming_passed") upcomingPassedCount++;
        }
      }
      return [
        passCount,
        failCount,
        upcomingPassedCount + upcomingFailedCount + upcomingPendingCount,
        pendingCount,
        upcomingFailedCount,
        upcomingPendingCount
      ];
    }

    function getInitialExpandedLevelIndex(newLevelCounts: { [index: number]: Array<number> }) {
      for(const index in newLevelCounts) {
        if(newLevelCounts[index][1] > 0 || newLevelCounts[index][4] > 0 || newLevelCounts[index][5] > 0) return index;
      }
      return -1;
    }
    
    if(checkResultsByLevel !== prevCheckResults) {
      setCheckResults(checkResultsByLevel);
      const newLevelCounts: { [index: number]: Array<number> } = {};
      const newExpandedLevels: { [index: number]: boolean } = {};
      checkResultsByLevel.forEach(({items, level}) => {
        newLevelCounts[level.index] = getLevelCounts(items.nodes);
      });
      const expandedLevelIndex = getInitialExpandedLevelIndex(newLevelCounts);
      for(const index in newLevelCounts) {
        if ({}.hasOwnProperty.call(newLevelCounts, index)) {
          newExpandedLevels[index] = expandedLevelIndex === index;
        }
      }
      setLevelCounts(newLevelCounts);
      setExpandedLevels(newExpandedLevels);
    }
  }, [checkResultsByLevel, prevCheckResults]);

  function getCombinedStatus(checkResult: CheckResult) {
    if (checkResult.status === "failed" && checkResult.check.enableOn !== null) {
      return "upcoming_failed";
    } else if (checkResult.status === "pending" && checkResult.check.enableOn !== null) {
      return "upcoming_pending";
    } else if (checkResult.status === "passed" && checkResult.check.enableOn !== null) {
      return "upcoming_passed";
    }
    return checkResult.status;
  }

  function getPassingPercentage() {
    return totalChecks === 0 ? 100 : Math.round(100 * totalPassingChecks / totalChecks);
  }

  const handleExpandedLevelIndexChange = (index: number) => (_event: SyntheticEvent<Element, Event>, newExpanded: boolean) => {
    const newExpandedLevels: { [index: number]: boolean } = cloneDeep(expandedLevels);
    newExpandedLevels[index] = !!newExpanded;
    setExpandedLevels(newExpandedLevels);
  };

  const accordionComponents = checkResults.map(({items, level}) => {
    return (
      <Accordion className={styles.accordion} key={level.name} expanded={expandedLevels[level.index]} onChange={handleExpandedLevelIndexChange(level.index)}>
        <AccordionSummary className={styles.accordionSummary} key={`${level.name}-summary`} expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{width: '90%'}}>
            { level.name } ({ items.nodes.length })
          </Typography>

          { levelCounts[level.index][2] !== 0 && [
              <WatchLaterIcon key={`${level.name}-pending-icon`} style={{ color: "gray" }} />,
              <p key={`${level.name}-pending-p`} style={{lineHeight: "24px", margin: "0px 15px 0px 5px"}}>{levelCounts[level.index][2]}</p>
          ] }

          { levelCounts[level.index][3] !== 0 && [
              <ErrorIcon key={`${level.name}-warning-icon`} style={{ color: "rgb(250, 204, 20)" }} />,
              <p key={`${level.name}-warning-p`} style={{lineHeight: "24px", margin: "0px 15px 0px 5px"}}>{levelCounts[level.index][3]}</p>
          ] }
          
          <CancelIcon style={{ color: "red" }} />
          <p style={{lineHeight: "24px", margin: "0px 15px 0px 5px"}}>{levelCounts[level.index][1]}</p>
          
          <CheckCircleIcon style={{ color: "green" }} />
          <p style={{lineHeight: "24px", margin: "0px 15px 0px 5px"}}>{levelCounts[level.index][0]}</p>
        </AccordionSummary>
        <AccordionDetails className={styles.accordionDetails}>
          {items.nodes.map((checkResult, index) => {
            return (
              <CheckResultDetails key={`details-${level.name}-${index}`} checkResult={checkResult} combinedStatus={getCombinedStatus(checkResult)} />
            );
          })}
          {items.nodes.length === 0 && (<p className={styles.coloredText}>There are no checks in this level.</p>)}
        </AccordionDetails>
      </Accordion>
    );
  })

  return (
    <InfoCard title="Checks" subheader={`Total Checks Passing: ${totalPassingChecks} / ${totalChecks} (${getPassingPercentage()}%)`}>
      {accordionComponents}
    </InfoCard>
  );
}
