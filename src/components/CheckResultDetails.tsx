import { Typography } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import ErrorIcon from '@material-ui/icons/Error';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import moment from 'moment';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { ReactElement } from 'react';
import { CheckResult } from '../types/OpsLevelData';
import { makeStyles } from '@material-ui/core';
import { BackstageTheme } from '@backstage/theme';


type Props = {
  checkResult: CheckResult,
  combinedStatus: string
}

const useStyles = makeStyles((theme: BackstageTheme) => {
  return {
    coloredText: {
      color: `${theme.palette.text.primary} !important`,
    },
    coloredSubtext: {
      color: `${theme.palette.text.secondary} !important`,
    },
  };
});

export function CheckResultDetails ({ checkResult, combinedStatus }: Props) {
  const styles = useStyles();

  const checkResultIcons: { [key: string]: ReactElement } = {
    "failed": (<CancelIcon />),
    "pending": (<ErrorIcon />),
    "passed": (<CheckCircleIcon />),
    "upcoming_failed": (<WatchLaterIcon />),
    "upcoming_pending": (<WatchLaterIcon />),
    "upcoming_passed": (<WatchLaterIcon />),
  };

  const resultColorMap: { [key: string]: {[key: string]: string} } = {
    "failed": {
      color: "red",
      backgroundColor: "#ff000033",
    },
    "pending": {
      color: "rgb(250, 204, 20)",
      backgroundColor: "#ffff0033",
    },
    "passed": {
      color: "#00ff00",
      backgroundColor: "#00ff0033",
    },
    "upcoming_failed": {
      color: "red",
      backgroundColor: "#00000033",
    },
    "upcoming_pending": {
      color: "rgb(250, 204, 20)",
      backgroundColor: "#00000033",
    },
    "upcoming_passed": {
      color: "#00ff00",
      backgroundColor: "#00000033",
    }
  }

  const CheckResultIcon = (
    <div style={{ color: resultColorMap[combinedStatus].color}}>
      { checkResultIcons[combinedStatus] }
    </div>
  );

  return (
    <Accordion id={`accordion-check-${checkResult.check.id}`} style={{ ...resultColorMap[combinedStatus], color: "inherit" }}>
      <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
        style={{
          display: 'inline-flex',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {CheckResultIcon}
        <Typography style={{marginLeft: '10px'}} className={styles.coloredText}>
          {checkResult.check.name}
          
          <span style={{fontSize: "smaller"}} className={styles.coloredSubtext}> &bull; <b>{checkResult.check.category?.name || "Uncategorized"}</b> check</span>
        </Typography>
      </AccordionSummary>

      <AccordionDetails className={styles.coloredText} style={{marginTop: "-20px"}}>
        <p className="p-will-be-enabled" hidden={!combinedStatus.startsWith("upcoming_")}>
          This check will be enabled on {moment.utc(checkResult.check.enableOn).format("MMMM Do YYYY, HH:mm:ss")} (UTC)
          <span className="span-is-failing" hidden={combinedStatus !== "upcoming_failed"}>, but it is currently failing.</span>
          <span className="span-not-evaluated" hidden={combinedStatus !== "upcoming_pending"}>, but it has not been evaluated yet.</span>
          <span className="span-is-passing" hidden={combinedStatus !== "upcoming_passed"}>, but it is currently passing.</span>
        </p>

        <p className="p-check-message">
          <b hidden={checkResult.status !== "failed"}>Error: </b>
          {checkResult.message} 
        </p>

        <p className={`${styles.coloredSubtext} p-last-updated`} id="trailer" hidden={!(checkResult.createdAt && checkResult.status !== "pending")} style={{fontSize: "smaller"}}>
          <b>Last updated:</b> { `${moment.utc(checkResult.createdAt).format("MMMM Do YYYY, HH:mm:ss")} (UTC)` }
        </p>
      </AccordionDetails>

    </Accordion>
  );
}
