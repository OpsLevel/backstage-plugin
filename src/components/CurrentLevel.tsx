import React from "react";
import { BackstageTheme } from "@backstage/theme";
import { makeStyles, Box, Typography } from "@material-ui/core";
import { InfoCircleOutlined, PieChartOutlined } from "@ant-design/icons";
import Tooltip from "@mui/material/Tooltip";
import { OverallLevel } from "../types/OpsLevelData";

type Props = {
  overallLevel: OverallLevel;
};

const useStyles = makeStyles((theme: BackstageTheme) => ({
  headerIcon: {
    marginRight: theme.spacing(1),
  },
  infoTooltip: {
    marginLeft: theme.spacing(1),
    fontSize: theme.typography.fontSize,
    lineHeight: theme.typography.h6.lineHeight,
    verticalAlign: "middle",
  },
}));

export default function CurrentLevel({ overallLevel }: Props) {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h6">
        <PieChartOutlined className={classes.headerIcon} />
        Current Level
        <Tooltip
          className={classes.infoTooltip}
          title="The current level is determined by identifying the lowest level of check that requires fixing in the rubric."
        >
          <InfoCircleOutlined />
        </Tooltip>
      </Typography>
      <Box
        sx={{
          borderColor: "primary.contrastText",
        }}
        display="inline-flex"
        justifyContent="center"
        padding="8px 20px"
        borderRadius={3}
        border={1}
        mb={2}
        mt={1}
      >
        <Typography variant="h6">{overallLevel.name}</Typography>
      </Box>
      <div>{overallLevel.description}</div>
    </>
  );
}
