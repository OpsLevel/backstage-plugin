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
  const [levelCounts, setLevelCounts] = useState<{ [index: number]: { [level: string]: number } }>({});
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
      const ret: { [key: string]: number } = {
        passed: 0,
        failed: 0,
        pending: 0,
        upcoming_passed: 0,
        upcoming_failed: 0,
        upcoming_pending: 0,
        upcoming: 0
      }
      for(const i in itemCheckResults) {
        if (!{}.hasOwnProperty.call(itemCheckResults, i)) continue;
        const combinedStatus = getCombinedStatus(itemCheckResults[i]);
        if(combinedStatus in ret) ret[combinedStatus]++;
      }
      ret.upcoming = ret.upcoming_passed + ret.upcoming_failed + ret.upcoming_pending;
      return ret;
    }

    function getInitialExpandedLevelIndex(newLevelCounts: { [index: number]: { [level: string]: number } }) {
      for(const index in newLevelCounts) {
        if(newLevelCounts[index].failed > 0 || newLevelCounts[index].upcoming_failed > 0 || newLevelCounts[index].upcoming_pending > 0) return index;
      }
      return -1;
    }
    
    if(checkResultsByLevel !== prevCheckResults) {
      setCheckResults(checkResultsByLevel);
      const newLevelCounts: { [index: number]: { [level: string]: number } } = {};
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
    let status = checkResult.status;
    if (checkResult.check.enableOn !== null) status = `upcoming_${status}`;
    return status;
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

          { levelCounts[level.index].upcoming !== 0 && [
            <WatchLaterIcon key={`${level.name}-pending-icon`} style={{ color: "#8C8C8C" }} />,
            <p key={`${level.name}-pending-p`} style={{lineHeight: "24px", margin: "0px 15px 0px 5px"}}>{levelCounts[level.index].upcoming}</p>
          ] }

          { levelCounts[level.index].pending !== 0 && [
            <ErrorIcon key={`${level.name}-warning-icon`} style={{ color: "#FFC53D" }} />,
            <p key={`${level.name}-warning-p`} style={{lineHeight: "24px", margin: "0px 15px 0px 5px"}}>{levelCounts[level.index].pending}</p>
          ] }
          
          <CancelIcon style={{ color: "#CF1322" }} />
          <p style={{lineHeight: "24px", margin: "0px 15px 0px 5px"}}>{levelCounts[level.index].failed}</p>
          
          <CheckCircleIcon style={{ color: "#52C41A" }} />
          <p style={{lineHeight: "24px", margin: "0px 15px 0px 5px"}}>{levelCounts[level.index].passed}</p>
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
