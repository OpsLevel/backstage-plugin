import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
} from '@backstage/core-components';
import { ExportEntitiesForm } from './ExportEntitiesForm';
import { OverallMaturityOverview } from './OverallMaturityOverview';
import { OverallMaturityCategoryBreakdown } from './OverallMaturityCategoryBreakdown';
import { useAsync, useAsyncFn } from 'react-use';
import { useApi } from '@backstage/core-plugin-api';
import { opslevelApiRef } from '../api';
import { OpsLevelOverallData } from '../types/OpsLevelData';



export const OverallMaturity = () => {
  const [data, setData] = useState<OpsLevelOverallData>();
  const opslevelApi = useApi(opslevelApiRef);
  const [fetchState, doFetch] = useAsyncFn(async () => {
    const result = await opslevelApi.getServicesReport();

    if (result) {
      setData(result);
    }
  });
  useAsync(doFetch);

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
            <ExportEntitiesForm />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
