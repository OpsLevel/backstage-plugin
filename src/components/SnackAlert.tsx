import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React from 'react';

export interface SnackbarProps {
  message: string;
  severity: 'error' | 'info' | 'success';
  open?: boolean;
  setOpen?: (open: boolean) => void;
  duration?: number;
}

export function SnackAlert(props: SnackbarProps) {
  return (
    <Snackbar
      open={props.open}
      autoHideDuration={props.duration}
      onClose={() => props.setOpen?.(false)}
    >
      <Alert severity={props.severity}>
        { props.message }
      </Alert>
    </Snackbar>
  );
}