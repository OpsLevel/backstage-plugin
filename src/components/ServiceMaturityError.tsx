import React from "react";
import { Button, Grid } from "@material-ui/core";

type Props = {
  onExportEntity: (event: React.MouseEvent) => void;
  exporting: boolean;
  error: React.ReactNode;
  showExport?: boolean;
  serviceUrl?: string;
};

export default function ServiceMaturityError({
  error,
  showExport,
  exporting,
  onExportEntity,
  serviceUrl,
}: Props) {
  return (
    <>
      <Grid item>{error}</Grid>
      {(serviceUrl || showExport) && (
        <Grid item>
          {showExport ? (
            <Button
              variant="contained"
              color="primary"
              onClick={onExportEntity}
              disabled={exporting}
            >
              Export Entity to OpsLevel
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              target="_blank"
              href={`${serviceUrl}/maturity-report`}
            >
              View Maturity in OpsLevel
            </Button>
          )}
        </Grid>
      )}
    </>
  );
}
