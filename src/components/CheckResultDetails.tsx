import { Box, Grid, Tooltip, makeStyles, Typography } from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';


const useStyles = makeStyles((theme: BackstageTheme) => ({
  passed: {
    color: theme.palette.success.main,
  },
  failed: {
    color: 'gray',
  },
}));

const checkResultIcons = {
  passed: (<CheckCircleOutlineIcon color="inherit" />),
  failed: (<RadioButtonUncheckedIcon color="inherit" />),
  pending: (<ErrorOutlineIcon color="inherit" />),
};

export function CheckResultDetails ({checkResult}) {

  console.log("####################", checkResult)

  const CheckResultIcon = (
    <div className={checkResult.status}>
      {checkResultIcons[checkResult.status]}
    </div>
  );


  return (
    <Accordion>
      <AccordionSummary
        style={{
          display: 'inline-flex',
          alignItems: 'start',
          justifyContent: 'start',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {CheckResultIcon}
        <Typography style={{marginLeft: '10px'}}>
          {checkResult.check.name}
        </Typography>

      </AccordionSummary>

      <AccordionDetails>
        <div id="content">
          TODO: check result message
        </div>

        <div id="trailer">
          TODO: include timestamp?
        </div>
      </AccordionDetails>

    </Accordion>
  );
}
