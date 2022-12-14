import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { InfoCard } from '@backstage/core-components';

export const OverallLevel = ({ maturityReport }: {maturityReport: any}) => {
  return (
    <InfoCard title="Current Level">
      <Box
        sx={{
          borderColor: 'primary.contrastText',
        }}
        display="inline-flex"
        justifyContent="center"
        padding="8px 20px"
        borderRadius={3}
        border={1}
        mb={2}
        mt={1}
      >
        <Typography variant="h6">{maturityReport.overallLevel.name}</Typography>
      </Box>
      <div>{maturityReport.overallLevel.description}</div>
    </InfoCard>
  );
};
