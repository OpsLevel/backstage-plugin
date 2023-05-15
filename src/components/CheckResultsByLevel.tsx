import { InfoCard } from '@backstage/core-components';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { CheckResultDetails } from './CheckResultDetails';

export function CheckResultsByLevel({ checkResultsByLevel }) {
  console.log("####################", checkResultsByLevel)

  const accordionComponents = checkResultsByLevel.map(({items, level}) => {
    return (
      <Accordion key={level.name}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          { level.name } ({items.nodes.length})
        </AccordionSummary>
        <AccordionDetails>
          {items.nodes.map((checkResult, index) => {
            return (
              <CheckResultDetails key={`${level.name}-${index}`} checkResult={checkResult} />
            );
          })}
        </AccordionDetails>
      </Accordion>
    );
  })

  return (
    <InfoCard title="Checks">
      {accordionComponents}
    </InfoCard>
  );
}
