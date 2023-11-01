import React from 'react';
import { SnackAlert, SnackbarProps } from './SnackAlert';
import { Button, Grid } from '@material-ui/core';

type Props = {
    opslevelUrl?: string,
    error: React.ReactNode,
    showExport?: boolean 
    onExportEntity: (event: React.MouseEvent) => void
    exporting: boolean,
    snackbar:SnackbarProps,
    snackbarOpen: boolean,
    onSetSnackbarOpen: (open: boolean) => void,
};

function ServiceMaturityError ({ opslevelUrl, error, showExport, onExportEntity, exporting, snackbar, snackbarOpen, onSetSnackbarOpen }: Props) {
  return (<Grid container spacing={5}>
    <SnackAlert  {...snackbar} open={snackbarOpen} setOpen={onSetSnackbarOpen} />
    <Grid item>{error}</Grid>
    <Grid item>
      { showExport ?
        <Button
          variant="contained"
          color="primary"
          onClick={onExportEntity}
          disabled={exporting}
        >
          Export Entity to OpsLevel
        </Button> :
        <Button
          variant="contained"
          color="primary"
          target="_blank"
          href={`${opslevelUrl}/maturity-report`}
        >
          View Maturity in OpsLevel
        </Button>
      }
    </Grid>
  </Grid>
  )
}
export default ServiceMaturityError;