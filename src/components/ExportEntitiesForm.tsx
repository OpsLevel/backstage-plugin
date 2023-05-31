import React, { useState } from 'react';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Button, Divider, Link, Typography } from '@material-ui/core';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { opslevelApiRef } from '../api';
import { useApi } from '@backstage/core-plugin-api';
import { OpsLevelApi } from '../types/OpsLevelData';
import { useAsync } from 'react-use';
import { BackstageTheme } from '@backstage/theme';
import { makeStyles } from '@material-ui/core';


function useListEntities(kind: string) {
  const catalogApi = useApi(catalogApiRef);
  return useAsync(async () => {
    return catalogApi.getEntities({
      filter: {
        kind,
      },
    });
  });
}

function useListAllEntities() {
  return {
    components: useListEntities('component'),
    users: useListEntities('user'),
    groups: useListEntities('group')
  }
}

async function exportEntity(entity: Entity, opslevelApi: OpsLevelApi, appendOutput: Function) {
  appendOutput(startExportMessage(entity));
  const result = await opslevelApi.exportEntity(entity);
  appendOutput(`${finishExportMessage(result)}\n`);
}

async function performExport(
  components: Array<Entity>, users: Array<Entity>, groups: Array<Entity>, opslevelApi: OpsLevelApi, appendOutput: Function
) {
  for (const entity of users) {
    await exportEntity(entity, opslevelApi, appendOutput);
  }

  for (const entity of groups) {
    await exportEntity(entity, opslevelApi, appendOutput);
  }  
  
  for (const entity of components) {
    await exportEntity(entity, opslevelApi, appendOutput);
  }
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

const useStyles = makeStyles((theme: BackstageTheme) => {
  return {
    outputComponentStyle: {
      backgroundColor: theme.palette.background.default,
      border: "1px solid black",
      marginTop: "1em",
      padding: "0.5em 0.8em",
      whiteSpace: "pre-line",
    }
  }
});

export default function ExportEntityForm() {
  const opslevelApi = useApi(opslevelApiRef);
  
  const entityStates = useListAllEntities();
  const error = entityStates.components.error || entityStates.users.error || entityStates.groups.error;
  const loading = entityStates.components.loading || entityStates.users.loading || entityStates.groups.loading;
  const components = entityStates.components.value?.items || [];
  const users = entityStates.users.value?.items || [];
  const groups = entityStates.groups.value?.items || [];
  const entityCount = components.length + users.length + groups.length;

  const [exporting, setExporting] = useState(false);
  const [output, setOutput] = useState("");
  let localOutput = output;

  const { outputComponentStyle } = useStyles();

  function appendOutput(message: string) {
    localOutput += message;
    setOutput(localOutput);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setExporting(true);
    await performExport(components, users, groups, opslevelApi, appendOutput)
    setExporting(false);
  }

  if (error) return <Alert severity="error">{error.message}</Alert>;

  const outputComponent = (
    output.length ? (
      <Typography variant="body1" className={outputComponentStyle}>
        {output}
      </Typography>
    ) : null
  )

  return (
    <span>
      <Typography paragraph>
        <b style={{color: "orange"}}>New:</b> Check out our <Link href="https://github.com/OpsLevel/backstage-plugin-backend" target="_blank">backend plugin</Link>, which
        enables automatic syncing!
      </Typography>
      <Typography paragraph>
        The <Link href="https://www.opslevel.com" target="_blank">OpsLevel</Link> Backstage plugin allows you to utilize OpsLevel’s powerful Service Maturity model within your
        Backstage Instance. After clicking <b>export</b> your
        Backstage Services will be populated into your OpsLevel account as Services. From there, you can
        apply <Link href="https://www.opslevel.com/docs/checks-and-filters" target="_blank">Checks</Link> to your
        Services and begin to build your <Link href="https://www.opslevel.com/docs/getting-started-with-rubrics" target="_blank">Maturity Rubric</Link>.
      </Typography>
      <Typography paragraph>
        Your <Link href="https://www.opslevel.com/docs/categories-and-levels#levels" target="_blank">Service Levels</Link> will
        be reflected back into your Backstage Instance via a new <b>Maturity</b> tab when viewing a Component.
        This tab provides a full <Link href="https://www.opslevel.com/docs/maturity-report" target="_blank">Maturity Report</Link> for
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
          href="https://app.opslevel.com/reports/rubric"
        >
          View Full Maturity Report in OpsLevel
        </Button>
        <Button variant="contained" color="primary" type="submit" disabled={exporting}>
          {exporting || loading ? (<CircularProgress />) : null}
          Export {entityCount} Entities to OpsLevel
        </Button>
      </form>
      {outputComponent}
    </span>
  );
};
