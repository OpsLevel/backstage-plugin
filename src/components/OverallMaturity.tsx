import React from 'react';
import { Grid } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
} from '@backstage/core-components';
import { ExportEntitiesForm } from './ExportEntitiesForm';

export const OverallMaturity = () => (
  <Page themeId="tool">
    <Header title="Service Maturity" subtitle="Powered by OpsLevel" />
    <Content>
      <Grid container spacing={3} direction="column">
        <Grid item>
          <ExportEntitiesForm />
        </Grid>
      </Grid>
    </Content>
  </Page>
);
