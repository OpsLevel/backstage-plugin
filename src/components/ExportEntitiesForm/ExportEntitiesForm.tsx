import React, { useState } from 'react';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Box, Button, Divider, Link, Typography } from '@material-ui/core';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { InfoCard } from '@backstage/core-components';
import { opslevelApiRef } from '../../api';
import { useApi } from '@backstage/core-plugin-api';
import { useAsync } from 'react-use';
import opslevelLogo from '../../images/opslevel-logo.svg';

function useListEntities() {
  const catalogApi = useApi(catalogApiRef);
  return useAsync(async () => {
    return catalogApi.getEntities({
      filter: {
        kind: 'component',
      },
    });
  });
}

function startExportMessage(entity: Entity) {
  const entityRef = stringifyEntityRef(entity);
  return `Exporting ${entityRef}... `;
}

function finishExportMessage(result: any) {
  let message = result.importEntityFromBackstage.actionMessage;
  if (result.importEntityFromBackstage.errors.length) {
    message += ` (error: ${result.importEntityFromBackstage.errors[0].message})`;
  }
  return message;
}

export function ExportEntitiesForm() {
  const opslevelApi = useApi(opslevelApiRef);

  const { value: entitesResponseBody, loading: loadingEntities, error } = useListEntities();
  const entities = entitesResponseBody?.items || [];
  const entityCount = entities.length;

  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    let localOutput = `${output}`;

    for (const entity of entities) {
      localOutput += startExportMessage(entity);
      setOutput(localOutput);

      const result = await opslevelApi.exportEntity(entity);

      localOutput += `${finishExportMessage(result)}\n`;
      setOutput(localOutput);
    }

    setLoading(false);
  }

  if (error) return <Alert severity="error">{error.message}</Alert>;

  const header = (
    <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
      Export Services to OpsLevel <img src={opslevelLogo} alt="opslevel logo" style={{marginLeft: "0.25em"}} />
    </div>
  );

  return (
    <InfoCard title={header}>
      <Typography paragraph>
        The <Link href="https://www.opslevel.com" target="_blank">OpsLevel</Link> Backstage plugin allows you to utilize OpsLevel’s powerful Service Maturity model within your
        Backstage Instance. After clicking <Box sx={{ fontWeight: "bold" }} display="inline">export</Box> your
        Backstage Services will be populated into your OpsLevel account as Services. From there, you can
        apply <Link href="https://www.opslevel.com/docs/checks-and-filters" target="_blank">Checks</Link> to your
        Services and begin to build your <Link href="https://www.opslevel.com/docs/getting-started-with-rubrics" target="_blank">Maturity Rubric</Link>.
      </Typography>
      <Typography paragraph>
        Your <Link href="https://www.opslevel.com/docs/categories-and-levels#levels" target="_blank">Service Levels</Link> will
        be reflected back into your Backstage Instance via a new <Box sx={{ fontWeight: "bold" }} display="inline">Maturity</Box> tab.
        This tab will provide you with a full <Link href="https://www.opslevel.com/docs/maturity-report" target="_blank">Maturity Report</Link> for
        your Backstage Services.
      </Typography>
      <Typography paragraph>
        OpsLevel’s Maturity Report will allow you to unlock valuable insights into the operational health of your
        Backstage Services as well as provide Service Owners the context they need to ensure they’re meeting their
        organization's best practices and standards.
      </Typography>
      <Divider />
      <form noValidate autoComplete="off" onSubmit={handleSubmit} style={{display: "flex", marginTop: "1em", justifyContent: "space-between"}}>
        <Button
          variant="contained"
          color="primary"
          target="_blank"
          href={"https://app.opslevel.com/reports/rubric"}
        >
          View Full Maturity Report in OpsLevel
        </Button>
        <Button variant="contained" color="primary" type="submit" disabled={loading}>
          {loading || loadingEntities ? (<CircularProgress />) : null}
          Export {entityCount} Entities to OpsLevel
        </Button>
      </form>
      <Typography variant="body1" style={{backgroundColor: "#242424", whiteSpace: "pre-line"}}>
        {output}
      </Typography>
    </InfoCard>
  );
};
