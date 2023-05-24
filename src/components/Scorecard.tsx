import React from "react";
import { InfoCard } from "@backstage/core-components";
import { levelColor } from "../helpers/level_color_helper";
import { Tooltip } from "@mui/material";
import { StyleRules, withStyles } from '@material-ui/core/styles';

type Level = {
  index: number;
  name: string;
};

type Props = {
  levels: Array<Level>;
  levelCategories:
    | Array<{ level: { name: string }; category: { name: string } }>
    | undefined,
  classes: { [prop: string]: string }
};

type State = {
  sortedLevels: Array<Level>;
};

const styles = (theme: any): StyleRules<any, any> => {
  return {
    levelHeaderRow: {
      textAlign: "center",
    },
    levelHeaderCell: {
      padding: "5px",
      paddingBottom: "10px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      color: theme.palette.text.primary,
    },
    categoryHeaderCell: {
      textAlign: "right",
      color: theme.palette.text.primary,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    inactiveCategoryHeaderCell: {
      textAlign: "right",
      color: theme.palette.text.disabled,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    fieldCell: {
      textAlign: "center",
    },
    field: {
      display: "inline-block",
      width: "calc(100% - 10px)",
      height: "20px",
      marginLeft: "5px",
      marginRight: "5px",
      borderRadius: "2px",
      maxWidth: "70px",
    },
    inactiveField: {
      border: `1px solid ${theme.palette.border}`,
      backgroundColor: theme.palette.background.default,
    },
    disabledField: {
      border: `1px solid ${theme.palette.border}`,
      backgroundColor: theme.palette.background.paper,
    },
  };
};

class Scorecard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      sortedLevels: [...props.levels].sort(
        (a: Level, b: Level) => a.index - b.index
      ),
    };
  }

  getFieldStyle(classes: { [prop: string]: string }, activeLevel: { name: string }, currentLevel: Level): [string, { [prop: string]: string }] {
    if (activeLevel === null)
      return [`${classes.field} ${classes.disabledField}`, {}];
    if (activeLevel.name !== currentLevel.name)
      return [`${classes.field} ${classes.inactiveField}`, {}];
    const color = levelColor(
      this.state.sortedLevels.length,
      this.state.sortedLevels.indexOf(currentLevel)
    );
    return [classes.field, {
      backgroundColor: color.secondary,
      border: `solid 1px ${color.secondary}`,
    }];
  }

  render() {
    const { classes } = this.props;
    return (
      <InfoCard title="Scorecard">
        <table
          style={{
            width: "100%",
            tableLayout: "fixed",
          }}
        >
          <thead>
            <tr className={classes.levelHeaderRow}>
              <td style={{ width: "25%" }}>&nbsp;</td>
              {this.state.sortedLevels.map((level) => (
                <td
                  key={`lvl_${level.name}`}
                  className={classes.levelHeaderCell}
                >
                  <Tooltip title={level.name} placement="top">
                    <span>{level.name}</span>
                  </Tooltip>
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {!!this.props.levelCategories &&
              this.props.levelCategories.map((lc) => (
                <tr key={`cat_${lc.category.name}`}>
                  <td
                    className={
                      !!lc.level
                        ? classes.categoryHeaderCell
                        : classes.inactiveCategoryHeaderCell
                    }
                  >
                    <Tooltip title={lc.category.name} placement="top">
                      <span>{lc.category.name}</span>
                    </Tooltip>
                  </td>
                  {this.state.sortedLevels.map((level) => (
                    <td
                      key={`cat_${lc.category.name}_lvl_${level.name}`}
                      className={classes.fieldCell}
                      style={{
                        width: `${75.0 / this.state.sortedLevels.length}%`
                      }}
                    >
                      <div
                        className={this.getFieldStyle(classes, lc.level, level)[0]}
                        style={this.getFieldStyle(classes, lc.level, level)[1]}
                      />
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </InfoCard>
    );
  }
}

export default withStyles(styles)(Scorecard);
