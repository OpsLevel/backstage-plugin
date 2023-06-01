import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
} from '@backstage/core-components';
import ExportEntitiesForm from './ExportEntitiesForm';
import { useAsync, useAsyncFn } from 'react-use';
import { useApi } from '@backstage/core-plugin-api';
import { opslevelApiRef } from '../api';
import { opslevelPluginApiRef } from '../backend_api';
import { OpsLevelOverallData } from '../types/OpsLevelData';
import OverallMaturityOverview from './OverallMaturityOverview';
import OverallMaturityCategoryBreakdown from './OverallMaturityCategoryBreakdown';
import { InfoCard } from "@backstage/core-components";
import { Progress } from "@backstage/core-components";
import opslevelLogo from '../images/opslevel-logo.svg';
import BackendExportEntitiesForm from './BackendExportEntitiesForm';


export const OverallMaturity = () => {
  const [data, setData] = useState<OpsLevelOverallData>();
  const [backendPluginPresent, setBackendPluginPresent] = useState<boolean | null>(null);
  const opslevelApi = useApi(opslevelApiRef);
  const opslevelPluginApi = useApi(opslevelPluginApiRef);
  const [fetchState, doFetch] = useAsyncFn(async () => {
    const result = await opslevelApi.getServicesReport();

    if (result) {
      setData(result);
    }
  });
  useAsync(doFetch);
  useEffect(() => { opslevelPluginApi.isPluginAvailable().then((res) => setBackendPluginPresent(res)) }, [])
  
  const header = (
    <div style={{display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      Export Entities to OpsLevel <img src={opslevelLogo} alt="opslevel logo" style={{marginLeft: "0.25em"}} />
    </div>
  );

  return (
    <Page themeId="tool">
      <Header title="Service Maturity" subtitle="Powered by OpsLevel" />
      <Content>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <OverallMaturityOverview
              loading={fetchState.loading}
              levels={data?.account?.rubric?.levels?.nodes || []}
              levelCounts={data?.account?.servicesReport?.levelCounts || []}
            />
          </Grid>
          <Grid item xs={8}>
            <OverallMaturityCategoryBreakdown
              loading={fetchState.loading}
              levels={data?.account?.rubric?.levels?.nodes || []}
              categoryLevelCounts={data?.account?.servicesReport?.categoryLevelCounts || []}
            />
          </Grid>
          <Grid item xs={12}>
            <InfoCard title={header}>
              {backendPluginPresent === null && (
                <Progress />
              )}
              {backendPluginPresent === true && (
                <BackendExportEntitiesForm />
              )}
              {backendPluginPresent === false && (
                <ExportEntitiesForm />
              )}
            </InfoCard>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
