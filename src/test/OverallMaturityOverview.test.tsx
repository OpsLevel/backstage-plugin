import React from 'react';
import { mount } from 'enzyme';
import OverallMaturityOverview from '../components/OverallMaturityOverview';


describe('OverallMaturityOverview', () => {
  const levels = [
    {index: 5, name: "Amazing"},
    {index: 4, name: "Great"},
    {index: 2, name: "Meh"},
    {index: 1, name: "Slightly better"},
    {index: 0, name: "Not so great"},
  ];

  const levelCounts = [
    {level: {name: "Amazing"}, serviceCount: 5},
    {level: {name: "Great"}, serviceCount: 3},
    {level: {name: "Not so great"}, serviceCount: 2},
  ]

  it('renders a progress bar in loading mode', () => {
    const wrapper = mount(<OverallMaturityOverview loading levels={[]} levelCounts={[]}/>);

    // It renders the card's title
    const headerCandidates = wrapper.find("span.MuiCardHeader-title");
    expect(headerCandidates.length).toEqual(1);
    expect(headerCandidates.at(0).text()).toEqual("Overview")

    // It renders a loading progress bar
    const contentCandidates = wrapper.find("div.MuiCardContent-root div");
    expect(contentCandidates.length).toEqual(2);
    const progressDiv = contentCandidates.at(1);
    expect(progressDiv.text()).toEqual("");

    // It doesn't render a chart
    expect(wrapper.find('svg').length).toEqual(0);
  });

  it('renders a donut chart when there is data', () => {
    // See issue - https://github.com/ZeeCoder/use-resize-observer/issues/40
    global.ResizeObserver = require('resize-observer-polyfill');

    const wrapper = mount(<OverallMaturityOverview loading={false} levels={levels} levelCounts={levelCounts}/>);

    // It renders the card's title
    const headerCandidates = wrapper.find("span.MuiCardHeader-title");
    expect(headerCandidates.length).toEqual(1);
    expect(headerCandidates.at(0).text()).toEqual("Overview");

    // It renders a chart canvas
    const canvasCandidates = wrapper.find("div.MuiCardContent-root div div");
    expect(canvasCandidates.length).toEqual(1);
    
    // It contains the level information
    const chartHtml = canvasCandidates.html();
    expect(chartHtml).toContain("Amazing (50%)");
    expect(chartHtml).toContain("Great (30%)");
    expect(chartHtml).toContain("Not so great (20%)");
  });
});
