import React from 'react';
import { mount } from 'enzyme';
import OverallMaturityCategoryBreakdown from '../components/OverallMaturityCategoryBreakdown';

describe('OverallMaturityCategoryBreakdown', () => {
  const levels = [
    {index: 5, name: "Amazing"},
    {index: 4, name: "Great"},
    {index: 2, name: "Meh"},
    {index: 1, name: "Slightly better"},
    {index: 0, name: "Not so great"},
  ];

  const categoryLevelCounts = [
    {category: {name: "Service Ownership"}, level: {name: "Amazing"}, serviceCount: 5},
    {category: {name: "Service Ownership"}, level: {name: "Meh"}, serviceCount: 2},
    {category: {name: "Reliability"}, level: {name: "Amazing"}, serviceCount: 3},
    {category: {name: "Reliability"}, level: {name: "Not so great"}, serviceCount: 4},
  ]

  function bandaidsForApexCharts() {
    // See issue - https://github.com/ZeeCoder/use-resize-observer/issues/40
    global.ResizeObserver = require('resize-observer-polyfill');
    // Fixes an ugly warning in Apexcharts
    // @ts-ignore
    global.SVGElement.prototype.getBBox = () => ({x: 0, y: 0 });
  }

  it('renders a progress bar in loading mode', () => {
    const wrapper = mount(<OverallMaturityCategoryBreakdown loading levels={[]} categoryLevelCounts={[]}/>);

    // It renders the card's title
    const headerCandidates = wrapper.find("span.MuiCardHeader-title");
    expect(headerCandidates.length).toEqual(1);
    expect(headerCandidates.at(0).text()).toEqual("Category Breakdown")

    // It renders a loading progress bar
    const contentCandidates = wrapper.find("div.MuiCardContent-root div");
    expect(contentCandidates.length).toEqual(2);
    const progressDiv = contentCandidates.at(1);
    expect(progressDiv.text()).toEqual("");

    // It doesn't render a chart
    expect(wrapper.find('svg').length).toEqual(0);
  });

  it('renders a bar chart when there is data', () => {
    bandaidsForApexCharts()
    const wrapper = mount(<OverallMaturityCategoryBreakdown loading={false} levels={levels} categoryLevelCounts={categoryLevelCounts}/>);

    // It renders the card's title
    const headerCandidates = wrapper.find("span.MuiCardHeader-title");
    expect(headerCandidates.length).toEqual(1);
    expect(headerCandidates.at(0).text()).toEqual("Category Breakdown")

    // It renders a chart canvas
    const canvasCandidates = wrapper.find("div.MuiCardContent-root div div");
    expect(canvasCandidates.length).toEqual(1);
    
    const chartHtml = canvasCandidates.html();

    // It contains the category information
    expect(chartHtml).toContain("Service Ownership");
    expect(chartHtml).toContain("Reliability");

    // It contains the level information
    expect(chartHtml).toContain("Amazing");
    expect(chartHtml).toContain("Meh");
    expect(chartHtml).toContain("Not so great");
  });
});
