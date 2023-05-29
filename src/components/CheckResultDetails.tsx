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
import MarkdownViewer from './MarkdownViewer';

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

const getShowWarnMessage = (checkResult: CheckResult) => {
  return ["payload", "generic"].includes(checkResult.check.type) && checkResult.warnMessage;
}

const getResultMessage = (checkResult: CheckResult) => {
  if (checkResult.check.type === "custom" && checkResult.status === "pending") {
    return "This is a Custom Check that has not been evaluated yet.  It requires an API request to be sent to our Custom Check API.";
  } else if (checkResult.status === "failed") {
    if (checkResult.check.type === "payload" || checkResult.check.type === "generic")
      return `**Error**:\n${checkResult.message}`;
    return `<b>Error</b>: ${checkResult.message}`;
  }
  return checkResult.message;
}

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
      color: "#CF1322",
      backgroundColor: "#ff000033",
    },
    "pending": {
      color: "#FFC53D",
      backgroundColor: "#ffff0033",
    },
    "passed": {
      color: "#52C41A",
      backgroundColor: "#00ff0033",
    },
    "upcoming_failed": {
      color: "#CF1322",
      backgroundColor: "#00000033",
    },
    "upcoming_pending": {
      color: "#FFC53D",
      backgroundColor: "#00000033",
    },
    "upcoming_passed": {
      color: "#52C41A",
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

        { getShowWarnMessage(checkResult) && (<span className="span-warn-message">
          <p className="p-unable-parse">We were unable to fully parse the result message due to the following Liquid errors:</p>
          <MarkdownViewer value={ `<code>${checkResult.warnMessage}</code>` } truncate/>
          <p className="p-unable-parse-following">We were able to parse the following from the message:</p>
        </span>) }

        
        <div style={ getShowWarnMessage(checkResult) ? { padding: "24px", backgroundColor: "rgba(0, 0, 0, 0.1)" } : {} }>
          <p className="p-check-message">
            <MarkdownViewer value={ getResultMessage(checkResult) } truncate={ false } />
          </p>
        </div>
        

        { getShowWarnMessage(checkResult) && (<p>Please fix and resend a payload to see an updated check result message.</p>)}

        <p className={`${styles.coloredSubtext} p-last-updated`} id="trailer" hidden={!(checkResult.createdAt && checkResult.status !== "pending")} style={{fontSize: "smaller"}}>
          <b>Last updated:</b> { `${moment.utc(checkResult.createdAt).format("MMMM Do YYYY, HH:mm:ss")} (UTC)` }
        </p>
      </AccordionDetails>

    </Accordion>
  );
}
