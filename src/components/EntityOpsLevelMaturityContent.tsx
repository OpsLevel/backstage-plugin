import React, { useState } from 'react';
import { Button, Grid } from '@material-ui/core';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { Progress } from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';
import { OverallLevel } from './OverallLevel';
import { EntityOpsLevelMaturityProgress } from './EntityOpsLevelMaturityProgress';
import { Scorecard } from './Scorecard';
import { opslevelApiRef } from '../api';
import { useApi } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useAsync, useAsyncFn } from 'react-use';
import { OpsLevelData } from '../types/OpsLevelData';
import { SnackAlert, SnackbarProps } from './SnackAlert';

export const EntityOpsLevelMaturityContent = () => {
  const { entity } = useEntity();
  const opslevelApi = useApi(opslevelApiRef);
  const serviceAlias = stringifyEntityRef(entity);

  const [opsLevelData, setOpsLevelData] = useState<OpsLevelData>();
  const [exporting, setExporting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarProps>({ message: "", severity: "info" });
  const [fetchState, doFetch] = useAsyncFn(async () => {
    const result = await opslevelApi.getServiceMaturityByAlias(serviceAlias)

    if (result) {
      setOpsLevelData(result);
    }
  });
  useAsync(doFetch, [serviceAlias])

  if (fetchState.loading || exporting) {
    return (<>
      <SnackAlert {...snackbar} open={snackbarOpen} setOpen={setSnackbarOpen} />
      <Progress />
    </>);
  }
  if (fetchState.error) {
    return (
      <Alert severity="error">
        {fetchState.error?.message}
      </Alert>
    );
  }

  const service = opsLevelData?.account?.service;

  if (!service) {
    const error = (<span>
      OpsLevel doesn't know about this service. Export it to get started.
      <br/>
      Alternatively, you can export all entities at once from&nbsp;
      <a href="/opslevel-maturity" target="_blank" style={{textDecoration: "underline"}}>the Maturity page</a>.
    </span>);

    return <ServiceMaturityError error={error} showExport />
  }

  const { maturityReport } = service;
  const levels = opsLevelData.account?.rubric?.levels?.nodes;
  const levelCategories = opsLevelData.account?.service?.maturityReport?.categoryBreakdown;

  if (!maturityReport) {
    return (<ServiceMaturityError error={"We don't have any maturity details for this service yet,"
      + " please check back in a few minutes."}/>)
  }

  async function exportEntity(event: React.MouseEvent) {
    event.preventDefault();
    setExporting(true);

    showSnackbar({ message: "Updating service in OpsLevel...", severity: "info" });

    const result = await opslevelApi.exportEntity(entity);

    showSnackbar({ message: result?.importEntityFromBackstage.actionMessage, severity: "success", duration: 5000 });

    setExporting(false);

    doFetch();
  }

  function showSnackbar (snackbarProps: SnackbarProps) {
    setSnackbarOpen(true);
    setSnackbar({ ...snackbarProps});
  }

  function ServiceMaturityError ({ error, showExport }: { error: React.ReactNode, showExport?: boolean }) {
    return (<Grid container spacing={5}>
      <SnackAlert  {...snackbar} open={snackbarOpen} setOpen={setSnackbarOpen} />
      <Grid item>{error}</Grid>
      <Grid item>
        { showExport ?
        <Button
          variant="contained"
          color="primary"
          onClick={exportEntity}
          disabled={exporting}
        >
          Export Entity to OpsLevel
        </Button> :
        <Button
          variant="contained"
          color="primary"
          target="_blank"
          href={`${service?.htmlUrl}/maturity-report`}
        >
          View Maturity in OpsLevel
        </Button>
        }
      </Grid>
    </Grid>
    )
  }

  function ServiceMaturityReport () {
    return (<>
      <Grid container item justifyContent="flex-end" spacing={2}>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={exportEntity}
            disabled={exporting}
          >
            Update Entity
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            target="_blank"
            href={`${service?.htmlUrl}/maturity-report`}
          >
            View Maturity in OpsLevel
          </Button>
        </Grid>
      </Grid>
      <Grid container item spacing={2}>
        <Grid item xs={4}>
          <OverallLevel maturityReport={maturityReport} />
        </Grid>
        <Grid item xs={8}>
          <EntityOpsLevelMaturityProgress levels={levels} serviceLevel={maturityReport?.overallLevel}/>
        </Grid>
        <Grid item xs={4}>
          <Scorecard levels={levels} levelCategories={levelCategories}/>
        </Grid>
      </Grid>
    </>);
  }

  return (
    <Grid container spacing={2}>
      <SnackAlert  {...snackbar} open={snackbarOpen} setOpen={setSnackbarOpen} />
      <ServiceMaturityReport />
    </Grid>
  );
};
