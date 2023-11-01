import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { Progress } from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';
import { opslevelApiRef } from '../api';
import { useApi } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useAsync, useAsyncFn } from 'react-use';
import { OpsLevelServiceData } from '../types/OpsLevelData';
import { SnackAlert, SnackbarProps } from './SnackAlert';
import ServiceMaturityError from './ServiceMaturityError';
import ServiceMaturityReport from './ServiceMaturityReport';

export const EntityOpsLevelMaturityContent = () => {
  const { entity } = useEntity();
  const opslevelApi = useApi(opslevelApiRef);
  const serviceAlias = stringifyEntityRef(entity);

  const [opsLevelData, setOpsLevelData] = useState<OpsLevelServiceData>();
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

  function showSnackbar (snackbarProps: SnackbarProps) {
    setSnackbarOpen(true);
    setSnackbar({ ...snackbarProps});
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


  const service = opsLevelData?.account?.service;
  if (!service) {
    const error = (<span>
      OpsLevel doesn't know about this service. Export it to get started.
      <br/>
      Alternatively, you can export all entities at once from&nbsp;
      <a href="/opslevel-maturity" target="_blank" style={{textDecoration: "underline"}}>the Maturity page</a>.
    </span>);

    return <ServiceMaturityError onSetSnackbarOpen={setSnackbarOpen} snackbar={snackbar} snackbarOpen={snackbarOpen} error={error} showExport onExportEntity={exportEntity} exporting={exporting} />
  }

  if (!service.maturityReport) {
    return (<ServiceMaturityError opslevelUrl={service?.htmlUrl} error={"We don't have any maturity details for this service yet,"
      + " please check back in a few minutes."}
    onExportEntity={exportEntity} exporting={exporting} 
    onSetSnackbarOpen={setSnackbarOpen} snackbar={snackbar} snackbarOpen={snackbarOpen} 
    />)
  }

  return (
    <Grid container spacing={2}>
      <SnackAlert  {...snackbar} open={snackbarOpen} setOpen={setSnackbarOpen} />
      <ServiceMaturityReport opsLevelData={opsLevelData} onExportEntity={exportEntity} exporting={exporting} opslevelUrl={service?.htmlUrl}/>
    </Grid>
  );
};
