import React, { useCallback } from "react";
import moment from "moment";
import { Link, Grid, Typography, makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { InfoCard } from "@backstage/core-components";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import { useApi, configApiRef } from "@backstage/core-plugin-api";
import { TeamOutlined } from "@ant-design/icons";
import { ChecksByCampaign } from "../types/OpsLevelData";
import ColoredCampaignStatus from "./ColoredCampaignStatus";

interface CampaignSummaryProps {
  campaignByService: ChecksByCampaign;
}

const useStyles = makeStyles((theme) => {
  return {
    card: {
      backgroundColor: theme.palette.background.default,
    },
    title: {
      display: "flex",
      fontSize: theme.typography.body1.fontSize,
    },
    statusSuccess: {
      color: theme.palette.success.main,
    },
    statusFailure: {
      color: theme.palette.error.main,
    },
    success: {
      marginRight: theme.spacing(1),
      color: theme.palette.success.main,
    },
    failure: {
      marginRight: theme.spacing(1),
      color: theme.palette.error.main,
    },
    campaignStatus: {
      marginLeft: theme.spacing(1),
    },
    nodeStatusesWrapper: {
      [theme.breakpoints.up("lg")]: {
        justifyContent: "flex-end",
      },
    },
    nodeStatusWrapper: {
      alignItems: "center",
      marginLeft: theme.spacing(1),
      display: "flex",
    },
    ownerIcon: {
      marginRight: theme.spacing(1),
    },
    actions: {
      display: "flex",
      justifyContent: "flex-end",
    },
  };
});

export default function CampaignSummary({
  campaignByService,
}: CampaignSummaryProps) {
  const classes = useStyles();

  const config = useApi(configApiRef);
  const opslevelUrl = config.getString("opslevel.baseUrl");

  const formatDate = useCallback((date: string): string => {
    return `${moment.utc(date).format("MMMM Do YYYY")} (UTC)`;
  }, []);

  return (
    <InfoCard
      className={classes.card}
      title={
        <span className={classes.title}>
          {campaignByService.status === "passing" && (
            <CheckCircleIcon
              className={classes.success}
              titleAccess="Passing Campaign Icon"
            />
          )}
          {campaignByService.status === "failing" && (
            <CancelIcon
              className={classes.failure}
              titleAccess="Failing Campaign Icon"
            />
          )}
          <span>{campaignByService.campaign?.name ?? "Campaign"}</span>
        </span>
      }
    >
      <Grid container>
        <Grid item xs={12} lg={campaignByService.items?.nodes ? 6 : 12}>
          <Typography>
            <TeamOutlined className={classes.ownerIcon} />
            <Link
              target="_blank"
              href={`${opslevelUrl}${campaignByService.campaign?.owner?.href}`}
            >
              {campaignByService.campaign?.owner?.name ?? "Unknown"}
            </Link>
          </Typography>
        </Grid>
        {campaignByService.items?.nodes && (
          <Grid
            className={classes.nodeStatusesWrapper}
            item
            xs={12}
            lg={6}
            container
            alignItems="center"
            justifyContent="flex-start"
          >
            <span className={classes.nodeStatusWrapper}>
              <CancelIcon
                className={classes.failure}
                titleAccess="Failing Checks Icon"
              />
              {
                campaignByService.items.nodes.filter(
                  (node) => node.status === "failed",
                ).length
              }
            </span>
            <span className={classes.nodeStatusWrapper}>
              <CheckCircleIcon
                className={classes.success}
                titleAccess="Passing Checks Icon"
              />
              {
                campaignByService.items.nodes.filter(
                  (node) => node.status === "passed",
                ).length
              }
            </span>
          </Grid>
        )}
      </Grid>
      {campaignByService.campaign?.status && (
        <Typography>
          Status:&nbsp;
          <ColoredCampaignStatus status={campaignByService.campaign.status} />
        </Typography>
      )}

      {campaignByService.campaign?.startDate && (
        <Typography>
          Start Date: {formatDate(campaignByService.campaign.startDate)}
        </Typography>
      )}
      {campaignByService.campaign?.targetDate && (
        <Typography>
          Target Date: {formatDate(campaignByService.campaign.targetDate)}
        </Typography>
      )}
      <div />
      <div className={classes.actions}>
        <Button variant="text">
          <Link
            href={`${opslevelUrl}${campaignByService.campaign?.href}`}
            target="_blank"
          >
            See Details
          </Link>
        </Button>
      </div>
    </InfoCard>
  );
}
