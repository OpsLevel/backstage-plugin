import React from "react";
import { InfoCard } from "@backstage/core-components";
import { Progress } from "@backstage/core-components";
import Chart from "react-apexcharts";
import { levelColorPalette } from "../helpers/level_color_helper";
import { levelsByCategory, fontFamily } from "../helpers/maturity_report_helper";
import cloneDeep from 'lodash/cloneDeep';
import { withTheme } from "@material-ui/core/styles";

type Props = {
  loading: Boolean,
  levels: Array<any>,
  categoryLevelCounts: Array<any>,
  theme: any,
};

type State = {
  data: Array<any>,
  options: any,
};

class OverallMaturityCategoryBreakdown extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let data: { [key: string]: Array<{ string: number }> } | {};
    if (props.loading)
      data = {};
    else
      data = levelsByCategory(props.levels, props.categoryLevelCounts);

    this.state = {
      data: this.computeSeries(data),
      options: {
        dataLabels: {
          style: {
            fontSize: 13,
            fontFamily,
          },
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        stroke: {
          width: 1,
          colors: ["#fff"],
        },
        yaxis: {
          labels: {
            style: {
              fontSize: 14,
              fontFamily,
              fontWeight: undefined,
              cssClass: undefined,
              colors: this.props.theme.palette.text.primary,
            },
          },
        },
        grid: {
          show: false,
        },
        tooltip: {
          theme: "dark",
          y: {
            formatter: (val: number) => {
              return `${val} Services`;
            },
          },
        },
        fill: {
          opacity: 1,
        },
        legend: {
          show: true,
          labels: {
            colors: [this.props.theme.palette.text.primary],
          }
        },
        colors: levelColorPalette(props.levels.length).map(
          (color) => color.secondary
        ),
        xaxis: {
          categories: Object.keys(data),
          labels: {
            style: {
              fontSize: 14,
              fontFamily,
              fontWeight: undefined,
              cssClass: undefined,
              colors: [this.props.theme.palette.text.primary],
            },
          },
        },
        chart: {
          type: "bar",
          height: "100%",
          stacked: true,
          stackType: "100%",
          toolbar: {
            show: false,
          },
        },
      },
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.levels !== this.props.levels ||
      prevProps.categoryLevelCounts !== this.props.categoryLevelCounts ||
      prevProps.loading !== this.props.loading
    ) {
      this.setDataFromProps();
    }
  }

  computeSeries(servicesByCategory: {
    [key: string]: Array<{ string: number }>;
  }) {
    const series: Array<{ name: String; data: Array<any> }> = [];

    for (const categoryName in servicesByCategory) {
      if (!Object.prototype.hasOwnProperty.call(servicesByCategory, categoryName)) continue;
      servicesByCategory[categoryName].forEach(
        (serviceLevel: { [key: string]: number }) => {
          const level = Object.keys(serviceLevel)[0];
          const serviceCount = serviceLevel[level];

          const existent_serie = series.find((serie) => serie.name === level);

          if (existent_serie) {
            existent_serie.data.push(serviceCount);
          } else {
            series.push({ name: level, data: [serviceCount] });
          }
        }
      );
    }

    return series;
  }

  setDataFromProps() {
    let data: { [key: string]: Array<{ string: number }> } | {};
    if (this.props.loading)
      data = {};
    else
      data = levelsByCategory(
        this.props.levels,
        this.props.categoryLevelCounts
      );
    const stateCopy = cloneDeep(this.state);
    this.setState({
      ...stateCopy,
      data: this.computeSeries(data),
      options: {
        ...stateCopy.options,
        colors: levelColorPalette(this.props.levels.length).map(
          (color) => color.secondary
        ),
        xaxis: {
          ...stateCopy.options.xaxis,
          categories: Object.keys(data),
        },
      },
    });
  }

  render() {
    return (
      <InfoCard title="Category Breakdown">
        <div style={{ height: "400px" }}>
          {this.props.loading && <Progress />}
          {!this.props.loading && (
            <Chart
              options={this.state.options}
              series={this.state.data}
              type="bar"
              width="100%"
              height="400px"
            />
          )}
        </div>
      </InfoCard>
    );
  }
}

export default withTheme(OverallMaturityCategoryBreakdown);
