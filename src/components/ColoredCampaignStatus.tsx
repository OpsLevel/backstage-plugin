import React from "react";
import { makeStyles } from "@material-ui/core";
import { CampaignStatus } from "../types/OpsLevelData";

interface Props {
  status: CampaignStatus;
}

const useStyles = makeStyles((theme) => {
  return {
    success: {
      color: theme.palette.success.main,
    },
    failure: {
      color: theme.palette.error.main,
    },
  };
});

export default function ColoredCampaignStatus({ status }: Props) {
  const classes = useStyles();

  let className;
  switch (status) {
    case "in_progress":
    case "scheduled":
      className = classes.success;
      break;
    case "delayed":
      className = classes.failure;
      break;
    default:
      className = "";
      break;
  }
  let title;
  switch (status) {
    case "in_progress":
      title = "In progress";
      break;
    case "delayed":
      title = "Delayed";
      break;
    case "scheduled":
      title = "Scheduled";
      break;
    case "draft":
      title = "Draft";
      break;
    case "ended":
      title = "Ended";
      break;
    default:
      break;
  }

  return <span className={className}>{title}</span>;
}
