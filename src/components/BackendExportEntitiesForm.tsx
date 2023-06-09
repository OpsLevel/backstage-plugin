import { useState, useEffect, useRef } from "react";
import FormControlLabel from '@mui/material/FormControlLabel';
import { Cron } from 'react-js-cron'
import 'react-js-cron/dist/styles.css'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Button, Typography, Link } from '@material-ui/core';
import { Progress } from "@backstage/core-components";
import Switch from '@mui/material/Switch';
import { opslevelPluginApiRef } from '../backend_api';
import { useApi } from '@backstage/core-plugin-api';
import { makeStyles } from '@material-ui/core';
import { BackstageTheme } from '@backstage/theme';
import { AutoSyncConfiguration, AutoSyncExecution } from "../types/OpsLevelData";
import React from "react";
import moment from 'moment';


const useStyles = makeStyles((theme: BackstageTheme) => {
  return {
    paddingCell: {
      paddingLeft: "10px",
      paddingRight: "10px"
    },
    configCell: {
      padding: "10px",
      backgroundColor: theme.palette.background.default,
      minWidth: "280px",
    },
    configHeaderCell: {
      padding: "10px",
      backgroundColor: theme.palette.bursts.backgroundColor.default,
      color: "white"
    },
    accordion: {
      backgroundColor: `${theme.palette.background.default} !important`,
      color: `${theme.palette.text.primary} !important`,
    },
    accordionDetails: {
      paddingTop: "0px !important"
    },
    outputComponentStyle: {
      backgroundColor: theme.palette.background.default,
      border: `1px solid ${theme.palette.border}`,
      marginTop: "1em",
      padding: "0.5em 0.8em",
      whiteSpace: "pre-line",
      height: "400px",
      overflowY: "scroll"
    },
    executionNavHeader: {
      marginTop: "10px",
      marginBottom: "10px",
      padding: "10px",
      fontSize: "larger"
    },
    executionNavHeaderText: {
      display: "inline-block",
    },
    cronContainer: {
      marginTop: "10px",
      fontSize: "16px",
      fontFamily: theme.typography.fontFamily,
      letterSpacing: "normal",
    },
    enableLabel: {
      fontFamily: theme.typography.fontFamily,
      fontSize: "16px",
      letterSpacing: "normal",
      marginLeft: "-16px",
    },
    saveButton: {
      marginTop: "20px"
    },
    progress: {
      marginTop: "20px"
    },
    expandIcon: {
      color: theme.palette.text.primary
    },
    paginationLink: {
      fontFamily: theme.typography.fontFamily,
      fontSize: "17px",
      marginTop: "-4px",
      letterSpacing: "normal",
    }
  };
});

export const sanitizeSchedule = (schedule: string) => {
  if(schedule.startsWith("0 ")) return schedule;

  // force minute to 0. Export should run at most every hour.
  return `0 ${schedule.substring(schedule.indexOf(" ") + 1)}`;
}

export default function BackendExportEntitiesForm() {
  const opslevelPluginApi = useApi(opslevelPluginApiRef);
  const [configuration, setConfiguration] = useState<AutoSyncConfiguration | null>(null);
  const [configurationSaving, setConfigurationSaving] = useState<boolean>(false);
  const [dirty, setDirty] = useState<boolean>(false);
  const [currentRun, setCurrentRun] = useState<AutoSyncExecution | null>(null);
  const [currentRunIndex, setCurrentRunIndex] = useState(0);
  const [runCount, setRunCount] = useState<number | null>(null);
  const [configExpanded, setConfigExpanded] = useState(false);

  const outputRef = useRef<any>();
  const currentIndexRef = useRef<number>();
  useEffect(() => { currentIndexRef.current = currentRunIndex }, [currentRunIndex]);
  const currentRunRef = useRef<AutoSyncExecution | null>();
  useEffect(() => { currentRunRef.current = currentRun }, [currentRun]);

  const setSchedule = (schedule: string) => {
    const newSchedule = sanitizeSchedule(schedule);
    if(configuration === null) return;
    if(newSchedule !== configuration.auto_sync_schedule) {
      setConfiguration({ auto_sync_enabled: configuration.auto_sync_enabled, auto_sync_schedule: newSchedule });
      setDirty(true);
    }
  };

  const setEnabled = (enabled: boolean) => {
    if(configuration === null) return;
    setConfiguration({ auto_sync_enabled: enabled, auto_sync_schedule: configuration.auto_sync_schedule });
    setDirty(true);
  };

  const loadRun = (index = currentRunIndex) => {
    opslevelPluginApi.getAutoSyncExecution(index)
      .then((ret) => {
        const contentChanged = ret.rows.length > 0 && ret.rows[0].output !== currentRunRef?.current?.output;
        setCurrentRun(ret.rows.length > 0 ? ret.rows[0] : null);
        setRunCount(ret.total_count);
        setCurrentRunIndex(index);
        if (contentChanged) {
          outputRef.current?.scroll?.({ top: outputRef.current.scrollHeight, behavior: 'smooth' });
        }
      });
  };

  const next = () => {
    setCurrentRun(null);
    setCurrentRunIndex(currentRunIndex + 1);
    loadRun(currentRunIndex + 1);
  };

  const prev = () => {
    setCurrentRun(null);
    setCurrentRunIndex(currentRunIndex - 1);
    loadRun(currentRunIndex - 1);
  };

  const saveConfiguration = () => {
    if(configuration === null) return;
    setConfigurationSaving(true);
    opslevelPluginApi.setAutoSyncConfiguration(configuration)
      .then((success) => {
        setDirty(!success);
        setConfigurationSaving(false);
        setConfigExpanded(!success);
      });
  };

  useEffect(() => {
    opslevelPluginApi.getAutoSyncConfiguration()
      .then((response) => setConfiguration(response));
  }, []);

  useEffect(loadRun, []);

  useEffect(() => {
    async function reloadIfFirst() {
      if(currentIndexRef.current === 0) loadRun(0);
    }
    setInterval(reloadIfFirst, 1000 * 5)
  }, []);

  const classes = useStyles();
  
  return (
    <span>
      <Accordion className={classes.accordion} expanded={configExpanded} onChange={(_, isExpanded) => setConfigExpanded(isExpanded)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon className={classes.expandIcon}/>}>
          <Typography><b>Configuration{dirty && " - unsaved changes"}</b></Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetails}>
          { !!configuration && (
            <span>
              <FormControlLabel
                value="start"
                control={
                  <Switch
                    color="primary"
                    data-testid="autosync-toggle"
                    checked={ configuration.auto_sync_enabled }
                    onChange={ (event) => setEnabled(event.target.checked) }
                    disabled={ configurationSaving }
                  />
                }
                label={<span className={classes.enableLabel}>Enable</span>}
                labelPlacement="start"
              />
              <div className={classes.cronContainer} data-testid="autosync-cron">
                <Cron
                  value={configuration.auto_sync_schedule}
                  setValue={ (val: string) => { setSchedule(val); } }
                  disabled={configurationSaving}
                  defaultPeriod="day"
                  allowedDropdowns={['period', 'months', 'month-days', 'week-days', 'hours']}
                  allowedPeriods={['year', 'month', 'week', 'day', 'hour']}
                />
              </div>
              <Button
                variant="contained"
                color="primary"
                className={classes.saveButton}
                disabled={configurationSaving}
                onClick={saveConfiguration}
              >
                Save
              </Button>
              &nbsp;
            </span>
          ) }
          { configurationSaving && <Progress className={classes.progress}/> }
        </AccordionDetails>
      </Accordion>
      { (runCount === null || runCount > 0) && [
        <div className={classes.executionNavHeader} key="nav-header" data-testid="execution-header">
          { currentRunIndex > 0 && <Link data-testid="execution-header-prev" href="#" onClick={prev} className={classes.paginationLink}>&lt;&lt;&lt;</Link> }
          { currentRunIndex <= 0 && <span data-testid="execution-header-prev">&lt;&lt;&lt;</span>}
          &nbsp;
          <div className={classes.executionNavHeaderText}>Showing execution {currentRunIndex + 1} of {runCount}</div>
          &nbsp;
          { currentRunIndex < (runCount || 0) - 1 && <Link data-testid="execution-header-next" href="#" onClick={next} className={classes.paginationLink}>&gt;&gt;&gt;</Link> }
          { currentRunIndex >= (runCount || 0) - 1 && <span data-testid="execution-header-next" className={classes.paginationLink}>&gt;&gt;&gt;</span>}
        </div>,
        <table key="info-table">
          <tbody>
            <tr>
              <td className={classes.configHeaderCell}>State</td>
              <td data-testid="run-state" className={classes.configCell}>{!!currentRun && (currentRun.state.charAt(0).toUpperCase() + currentRun.state.slice(1))}</td>
              <td className={classes.paddingCell}/>
              <td className={classes.configHeaderCell}>Trigger</td>
              <td data-testid="run-trigger" className={classes.configCell}>{!!currentRun && (currentRun.trigger.charAt(0).toUpperCase() + currentRun.trigger.slice(1))}</td>
            </tr>
            <tr>
              <td className={classes.configHeaderCell}>Started at</td>
              <td data-testid="run-started-at" className={classes.configCell}>{!!currentRun ? `${moment.utc(currentRun.started_at).format("MMMM Do YYYY, HH:mm:ss")} (UTC)` : ""}</td>
              <td className={classes.paddingCell}/>
              <td className={classes.configHeaderCell}>Completed at</td>
              <td data-testid="run-completed-at" className={classes.configCell}>{!!currentRun?.completed_at ? `${moment.utc(currentRun.completed_at).format("MMMM Do YYYY, HH:mm:ss")} (UTC)` : ""}</td>
            </tr>
          </tbody>
        </table>,
        <Typography variant="body1" className={classes.outputComponentStyle} ref={outputRef} key="text-output">
          {!!currentRun && <span data-testid="text-output">{currentRun.output}</span>}
        </Typography>,
        <div style={{ height: "4px" }} key="progress">
          { !currentRun && <Progress /> }
        </div>
      ] }
      { (runCount !== null && runCount === 0) && <Typography data-testid="no-run-msg" style={{ margin: "15px" }}>Export has never run. Please ensure export is enabled in the configuration above.</Typography>}
    </span>
  );
};
