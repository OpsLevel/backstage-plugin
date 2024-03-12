import React, { useState, useEffect } from "react";
import { InfoCard } from "@backstage/core-components";
import { BackstageTheme } from "@backstage/theme";
import { useApi } from "@backstage/core-plugin-api";
import { FlagOutlined} from "@ant-design/icons";
import { makeStyles } from "@material-ui/core";
import {  Grid } from '@material-ui/core';
import { opslevelApiRef } from "../api";
import CampaignSummary from "./CampaignSummary";
import { CampaignsResponse, ChecksByCampaign } from "../types/OpsLevelData";

const useStyles = makeStyles((theme: BackstageTheme) => ({
  headerIcon: {
    marginRight: theme.spacing(1),
  },
}));

type Props = {
  serviceId: string;
}

export default function Campaigns({serviceId}: Props) {
  const classes = useStyles();
  const opslevelApi = useApi(opslevelApiRef);
  const [campaignsByService, setCampaignsByService]: [ChecksByCampaign[], (campaignsByService: ChecksByCampaign[]) => void] = useState<ChecksByCampaign[]>();
  console.log(serviceId)

  useEffect(() => {
    // Eventually we want to use Suspense https://github.com/facebook/react/issues/14326
    const fetchCampaigns = async () => {
    const campaignsResponse: CampaignsResponse= await opslevelApi.getCampaigns(serviceId);


    if (campaignsResponse) {
      setCampaignsByService(campaignsResponse.account.service?.campaignReport?.checkResultsByCampaign?.nodes??[]);
    }
};
fetchCampaigns();
},[])
if (!campaignsByService) {
  return null;
}
console.log('campaigns', campaignsByService)

  return (
    <div>
    <InfoCard title={<span>
<FlagOutlined  className={classes.headerIcon} />
      Campaigns</span>}>
        <Grid container>
      {campaignsByService.map((campaignByService => <Grid item xs={12}><CampaignSummary key={campaignByService.campaign?.id ?? ''} campaignByService={campaignByService} /></Grid>))}
</Grid>
      </InfoCard>
      </div>

  );
}
