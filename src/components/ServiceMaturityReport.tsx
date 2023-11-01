import React from 'react';
import { Button, Grid } from '@material-ui/core';
import { EntityOpsLevelMaturityProgress } from './EntityOpsLevelMaturityProgress';
import { CheckResultsByLevel } from './CheckResultsByLevel';
import { OpsLevelServiceData } from '../types/OpsLevelData';
import ServiceMaturitySidebar from './ServiceMaturitySidebar';

type Props = {
    opslevelUrl?: string,
    onExportEntity: (event: React.MouseEvent) => void
    exporting: boolean,
    opsLevelData: OpsLevelServiceData,
};

function ServiceMaturityReport ({ opslevelUrl, onExportEntity, exporting, opsLevelData}: Props) {

  const maturityReport = opsLevelData?.account?.service.maturityReport;
  const levels = opsLevelData.account?.rubric?.levels?.nodes;
  const levelCategories = opsLevelData.account?.service?.maturityReport?.categoryBreakdown;
  const checkResultsByLevel = opsLevelData.account?.service?.serviceStats?.rubric?.checkResults?.byLevel?.nodes;
  const checkStats = opsLevelData.account?.service?.checkStats;

  return (<>
    <Grid container item xs={12} justifyContent="flex-end">
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={onExportEntity}
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
          href={`${opslevelUrl}/maturity-report`}
        >
            View Maturity in OpsLevel
        </Button>
      </Grid>
    </Grid>
    <Grid container item>
      <Grid item xs={4} direction="column">
        {maturityReport?.overallLevel && 
          <ServiceMaturitySidebar levels={levels} levelCategories={levelCategories} overallLevel={maturityReport.overallLevel} />
        }
      </Grid>
      <Grid container item xs={8} direction="column">
        <Grid item>
          <EntityOpsLevelMaturityProgress
            levels={levels}
            serviceLevel={maturityReport?.overallLevel}
          />
        </Grid>
        <Grid item>
          <CheckResultsByLevel
            checkResultsByLevel={checkResultsByLevel}
            totalChecks={checkStats.totalChecks}
            totalPassingChecks={checkStats.totalPassingChecks}
          />
        </Grid>
      </Grid>
    </Grid>
  </>);
}

export default ServiceMaturityReport;