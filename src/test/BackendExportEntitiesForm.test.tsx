import React from 'react';
import BackendExportEntitiesForm from '../components/BackendExportEntitiesForm';
import { waitFor, screen, render} from '@testing-library/react'
import { AutoSyncExecution } from '../types/OpsLevelData';

const CONFIG_ENABLED_EVERY_MINUTE = {
  auto_sync_enabled: true,
  auto_sync_schedule: "* * * *",
};

const EXECUTION_ROW = {
  id: 36,
  trigger: "scheduled",
  state: "completed",
  started_at: "2023-05-30T19:45:24.438Z",
  completed_at: "2024-05-30T19:45:24.438Z",
  output: "very important"
};

const EXECUTION_RESPONSE = {
  total_count: "10",
  rows: [EXECUTION_ROW]
}

const apiMock = {
  getAutoSyncConfiguration: jest.fn(),
  getAutoSyncExecution: jest.fn(),
}
jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useApi: () => apiMock,
}));
jest.mock('@material-ui/core/styles', () => ({
  ...jest.requireActual('@material-ui/core/styles'),
  makeStyles: () => { return () => { return {accordion: 'a' } } },
}));

const renderComponent = async (config = CONFIG_ENABLED_EVERY_MINUTE, runs: { total_count: string, rows: Array<AutoSyncExecution> } = EXECUTION_RESPONSE) => {
  apiMock.getAutoSyncConfiguration.mockReturnValue(Promise.resolve(config));
  apiMock.getAutoSyncExecution.mockReturnValue(Promise.resolve(runs));
  render(<BackendExportEntitiesForm />);
  await waitFor(() => expect(screen.getByTestId(runs.rows.length === 0 ? "no-run-msg" : "text-output")).toBeInTheDocument());
};

describe('BackendExportEntitiesForm', () => {
  it('displays the configuration if auto sync is on at every minute', async () => {
    await renderComponent();

    expect(screen.getByTestId("autosync-toggle")).toHaveClass("Mui-checked");
    // ugly but it confirms it's received the data; we're not testing that component
    expect(screen.getByTestId("autosync-cron")).toHaveTextContent("Everydayat every hour: every minuteClear");
  });

  it('displays the configuration if auto sync is off and set to every 5 minutes', async () => {
    await renderComponent({ auto_sync_enabled: false, auto_sync_schedule: "*/5 * * * *" });

    expect(screen.getByTestId("autosync-toggle")).not.toHaveClass("Mui-checked");
    expect(screen.getByTestId("autosync-cron")).toHaveTextContent("Everyhouratevery 5 minute(s)Clear");
  });

  it('displays the execution header as expected if it is the first execution', async () => {
    await renderComponent();

    screen.debug(screen.getByTestId("execution-header"))
    expect(screen.getByTestId("execution-header")).toHaveTextContent("<<< Showing execution 1 of 10 >>>");
    expect(screen.getByTestId("execution-header-prev")).not.toHaveClass('MuiLink-root');
    expect(screen.getByTestId("execution-header-next")).toHaveClass('MuiLink-root');
  });

  it('displays the execution header as expected if it is the last execution', async () => {
    await renderComponent(undefined, { total_count: "1", rows: [EXECUTION_ROW] });

    expect(screen.getByTestId("execution-header")).toHaveTextContent("<<< Showing execution 1 of 1 >>>");
    expect(screen.getByTestId("execution-header-prev")).not.toHaveClass('MuiLink-root');
    expect(screen.getByTestId("execution-header-next")).not.toHaveClass('MuiLink-root');
  });

  it('displays a message if there are no executions', async () => {
    await renderComponent(undefined, { total_count: "0", rows: [] });

    expect(screen.getByTestId("no-run-msg")).toHaveTextContent("It looks like no export has run yet. Please come back later.");
  });

  it('does not display the no runs message if there are executions', async () => {
    await renderComponent();

    expect(screen.queryByTestId("no-run-msg")).toBeNull();
  });

  it('displays the right header fields', async () => {
    await renderComponent();

    expect(screen.getByTestId("run-state")).toHaveTextContent("Completed");
    expect(screen.getByTestId("run-trigger")).toHaveTextContent("Scheduled");
    expect(screen.getByTestId("run-started-at")).toHaveTextContent("May 30th 2023, 19:45:24 (UTC)");
    expect(screen.getByTestId("run-completed-at")).toHaveTextContent("May 30th 2024, 19:45:24 (UTC)");
  });

  it('displays the right header fields, alternate version with blank fields', async () => {
    await renderComponent(undefined, {
      total_count: "10",
      rows: [{
        id: 36,
        trigger: "scheduled",
        state: "running",
        started_at: "2023-05-30T19:45:24.438Z",
        completed_at: null,
        output: "very important"
      }]
    });

    expect(screen.getByTestId("run-state")).toHaveTextContent("Running");
    expect(screen.getByTestId("run-trigger")).toHaveTextContent("Scheduled");
    expect(screen.getByTestId("run-started-at")).toHaveTextContent("May 30th 2023, 19:45:24 (UTC)");
    expect(screen.getByTestId("run-completed-at")).toHaveTextContent("");
  });

  it('displays the right text output', async () => {
    await renderComponent();

    expect(screen.getByTestId("text-output")).toHaveTextContent("very important");
  });
});