import React from "react";
import { InfoCard } from "@backstage/core-components";
import { Progress } from "@backstage/core-components";
import Chart from "react-apexcharts";
import { levelColorPalette } from "../helpers/level_color_helper";
import { servicesByLevel, fontFamily } from "../helpers/maturity_report_helper";
import cloneDeep from 'lodash/cloneDeep';
import { withTheme } from "@material-ui/core/styles";

type Props = {
  loading: Boolean,
  levels: Array<any>,
  levelCounts: Array<any>,
  theme: any,
};

type State = {
  data: Array<any>,
  options: any,
};

class OverallMaturityOverview extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let data: { String: Number }[];
    if (props.loading)
      data = [];
    else
      data = servicesByLevel(props.levels, props.levelCounts);

    this.state = {
      data: data.length > 0 ? data.flatMap((obj) => Object.values(obj)) : [],
      options: {
        chart: {
          foreColor: this.props.theme.palette.text.primary,
        },
        plotOptions: {
          pie: {
            expandOnClick: false,
            donut: {
              size: "70%",
              labels: {
                show: true,
                name: {
                  show: false,
                },
                value: {
                  show: true,
                  fontFamily,
                },
                total: {
                  show: true,
                  showAlways: true,
                  label: undefined,
                  fontSize: "16px",
                  fontFamily,
                  fontWeight: 400,
                  formatter: (w: any) => {
                    const total = w.globals.seriesTotals.reduce(
                      (a: number, b: number) => {
                        return a + b;
                      },
                      0
                    );
                    return `${total} Services`;
                  },
                },
              },
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: (val: number) => {
            const percent = Math.round(val);
            return `${percent}%`;
          },
        },
        colors: levelColorPalette(data.length).map((color) => color.secondary),
        labels: data.length > 0 ? data.flatMap((obj) => Object.keys(obj)) : [],
        legend: {
          fontFamily,
          onItemClick: {
            toggleDataSeries: false,
          },
          markers: {
            radius: 2,
            width: 12,
            height: 12,
          },
          position: "top",
          formatter: (val: number, opts: any) => {
            const percent = opts.w.globals.seriesPercent[opts.seriesIndex];
            let roundedPercent = 0;
            if (!isNaN(percent)) {
              roundedPercent = Math.round(percent);
            }
            return `${val} (${roundedPercent}%)`;
          },
        },
        tooltip: {
          enabled: true,
          theme: "dark",
          fillSeriesColor: false,
          y: {
            formatter: (value: number) => {
              return `${value} Services`;
            },
            title: {
              formatter: (seriesName: string) => `${seriesName}:`,
            },
          },
        },
      },
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.levels !== this.props.levels ||
      prevProps.levelCounts !== this.props.levelCounts ||
      prevProps.loading !== this.props.loading
    ) {
      this.setDataFromProps();
    }
  }

  setDataFromProps() {
    let data: { String: Number }[];
    if (this.props.loading)
      data = [];
    else
      data = servicesByLevel(this.props.levels, this.props.levelCounts);

    const stateCopy = cloneDeep(this.state);
    this.setState({
      ...stateCopy,
      data: data.length > 0 ? data.flatMap((obj) => Object.values(obj)) : [],
      options: {
        ...stateCopy.options,
        colors: levelColorPalette(data.length).map((color) => color.secondary),
        labels: data.length > 0 ? data.flatMap((obj) => Object.keys(obj)) : [],
      },
    });
  }

  render() {
    return (
      <InfoCard title="Overview">
        <div style={{ height: "400px" }}>
          {this.props.loading && <Progress />}
          {!this.props.loading && (
            <Chart
              options={this.state.options}
              series={this.state.data}
              type="donut"
              width="100%"
              height="400px"
            />
          )}
        </div>
      </InfoCard>
    );
  }
}

export default withTheme(OverallMaturityOverview);
