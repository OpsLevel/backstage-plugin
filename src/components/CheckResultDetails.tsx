import { Link, Typography, Box, Tooltip, makeStyles } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import WatchLaterIcon from "@material-ui/icons/WatchLater";
import ErrorIcon from "@material-ui/icons/Error";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion from "@mui/material/Accordion";
import moment from "moment";
import {
  FileDoneOutlined,
  TableOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { ReactElement, useState } from "react";
import { BackstageTheme } from "@backstage/theme";
import { useApi, configApiRef } from "@backstage/core-plugin-api";
import { CheckResult, CheckResultStatus } from "../types/OpsLevelData";
import MarkdownViewer from "./MarkdownViewer";

type Props = {
  checkResult: CheckResult;
  combinedStatus: CheckResultStatus;
};

const useStyles = makeStyles((theme: BackstageTheme) => {
  return {
    coloredText: {
      color: `${theme.palette.text.primary} !important`,
    },
    coloredSubtext: {
      color: `${theme.palette.text.secondary} !important`,
    },
    separator: {
      color: `${theme.palette.text.secondary}`,
    },
    checkResultIcon: {
      marginRight: theme.spacing(1),
      display: "inline-flex",
    },
    infoTooltip: {
      fontSize: theme.typography.button.fontSize,
    },
  };
});

const getShowWarnMessage = (checkResult: CheckResult) => {
  return (
    ["payload", "generic"].includes(checkResult.check.type) &&
    checkResult.warnMessage
  );
};

const getResultMessage = (checkResult: CheckResult) => {
  if (checkResult.check.type === "custom" && checkResult.status === "pending") {
    return "This is a Custom Check that has not been evaluated yet.  It requires an API request to be sent to our Custom Check API.";
  }
  if (checkResult.status === "failed") {
    if (
      checkResult.check.type === "payload" ||
      checkResult.check.type === "generic"
    ) {
      return `**Error**:\n${checkResult.message}`;
    }
    return `<b>Error</b>: ${checkResult.message}`;
  }
  return checkResult.message;
};

export default function CheckResultDetails({
  checkResult,
  combinedStatus,
}: Props) {
  const [expanded, setExpanded] = useState<boolean>(
    combinedStatus.endsWith("failed") || combinedStatus.endsWith("pending"),
  );
  const styles = useStyles();
  const config = useApi(configApiRef);
  const opslevelUrl = config.getString("opslevel.baseUrl");

  const handleOnExpansionChange = (
    _: React.SyntheticEvent,
    isExpanded: boolean,
  ) => setExpanded(isExpanded);

  const checkResultIcons: { [key in CheckResultStatus]: ReactElement } = {
    failed: <CancelIcon />,
    pending: <ErrorIcon />,
    passed: <CheckCircleIcon />,
    upcoming_failed: <WatchLaterIcon />,
    upcoming_pending: <WatchLaterIcon />,
    upcoming_passed: <WatchLaterIcon />,
  };

  const resultColorMap: {
    [key in CheckResultStatus]: { color: string; backgroundColor: string };
  } = {
    failed: {
      color: "#CF1322",
      backgroundColor: "#ff000033",
    },
    pending: {
      color: "#FFC53D",
      backgroundColor: "#ffff0033",
    },
    passed: {
      color: "#52C41A",
      backgroundColor: "#00ff0033",
    },
    upcoming_failed: {
      color: "#CF1322",
      backgroundColor: "#00000033",
    },
    upcoming_pending: {
      color: "#FFC53D",
      backgroundColor: "#00000033",
    },
    upcoming_passed: {
      color: "#52C41A",
      backgroundColor: "#00000033",
    },
  };

  return (
    <Accordion
      id={`accordion-check-${checkResult.check.id}`}
      style={{ ...resultColorMap[combinedStatus], color: "inherit" }}
      expanded={expanded}
      onChange={handleOnExpansionChange}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        style={{
          display: "inline-flex",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Box style={{ display: "flex", alignItems: "center" }}>
          <div
            className={styles.checkResultIcon}
            style={{ color: resultColorMap[combinedStatus].color }}
          >
            {checkResultIcons[combinedStatus]}
          </div>
          <Typography className={styles.coloredText}>
            {checkResult.check.name}

            {checkResult.check.category && (
              <>
                <span className={styles.separator}>&#65372;</span>
                <span className={styles.coloredSubtext}>
                  <Tooltip
                    className={styles.infoTooltip}
                    title={`This check belongs to ${
                      checkResult.check.isScorecardCheck
                        ? "a scorecard."
                        : "the main rubric"
                    }.`}
                  >
                    <span>
                      {checkResult.check.isScorecardCheck && (
                        <FileDoneOutlined className={styles.checkResultIcon} />
                      )}
                      {!checkResult.check.isScorecardCheck && (
                        <TableOutlined className={styles.checkResultIcon} />
                      )}
                    </span>
                  </Tooltip>
                  <Link
                    href={`${opslevelUrl}${checkResult.check.category.container.href}`}
                  >
                    {checkResult.check.category.name}
                  </Link>
                </span>
              </>
            )}
            {checkResult.check.owner && (
              <>
                <span className={styles.separator}>&#65372;</span>
                <span className={styles.coloredSubtext}>
                  <TeamOutlined className={styles.checkResultIcon} />
                  {}
                  <Link href={`${opslevelUrl}${checkResult.check.owner.href}`}>
                    {checkResult.check.owner.name}
                  </Link>
                </span>
              </>
            )}
          </Typography>
        </Box>
      </AccordionSummary>

      <AccordionDetails
        className={styles.coloredText}
        style={{ marginTop: "-20px" }}
      >
        <p
          className="p-will-be-enabled"
          hidden={!combinedStatus.startsWith("upcoming_")}
        >
          This check will be enabled on{" "}
          {moment
            .utc(checkResult.check.enableOn)
            .format("MMMM Do YYYY, HH:mm:ss")}{" "}
          (UTC)
          {combinedStatus === "upcoming_failed" && (
            <span className="span-is-failing">
              , but it is currently failing.
            </span>
          )}
          {combinedStatus === "upcoming_pending" && (
            <span className="span-not-evaluated">
              , but it has not been evaluated yet.
            </span>
          )}
          {combinedStatus === "upcoming_passed" && (
            <span className="span-is-passing">
              , but it is currently passing.
            </span>
          )}
        </p>

        {getShowWarnMessage(checkResult) && (
          <span className="span-warn-message">
            <p className="p-unable-parse">
              We were unable to fully parse the result message due to the
              following Liquid errors:
            </p>
            <MarkdownViewer
              value={`<code>${checkResult.warnMessage}</code>`}
              truncate
            />
            <p className="p-unable-parse-following">
              We were able to parse the following from the message:
            </p>
          </span>
        )}

        <div
          style={
            getShowWarnMessage(checkResult)
              ? { padding: "24px", backgroundColor: "rgba(0, 0, 0, 0.1)" }
              : {}
          }
        >
          <p className="p-check-message">
            <MarkdownViewer
              value={getResultMessage(checkResult)}
              truncate={false}
            />
          </p>
        </div>

        {getShowWarnMessage(checkResult) && (
          <p>
            Please fix and resend a payload to see an updated check result
            message.
          </p>
        )}

        <p
          className={`${styles.coloredSubtext} p-last-updated`}
          id="trailer"
          hidden={!(checkResult.createdAt && checkResult.status !== "pending")}
          style={{ fontSize: "smaller" }}
        >
          <b>Last updated:</b>{" "}
          {`${moment
            .utc(checkResult.createdAt)
            .format("MMMM Do YYYY, HH:mm:ss")} (UTC)`}
        </p>
      </AccordionDetails>
    </Accordion>
  );
}
