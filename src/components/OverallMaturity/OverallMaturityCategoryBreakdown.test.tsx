import React from "react";
import { render, screen } from "@testing-library/react";
import OverallMaturityCategoryBreakdown from "./OverallMaturityCategoryBreakdown";

describe("OverallMaturityCategoryBreakdown", () => {
  function bandaidsForApexCharts() {
    // Fixes an ugly warning in Apexcharts
    // @ts-ignore
    global.SVGElement.prototype.getBBox = () => ({ x: 0, y: 0 });
  }

  it("renders a progress bar in loading mode", () => {
    render(
      <OverallMaturityCategoryBreakdown
        loading
        levels={[]}
        categoryLevelCounts={[]}
      />,
    );

    // It renders the card's title
    expect(screen.getByText("Category Breakdown")).toBeInTheDocument();

    // It doesn't render a chart
    expect(document.querySelectorAll("svg").length).toEqual(0);
  });

  it.only("renders a bar chart when there is data", () => {
    const levels = [
      { index: 5, name: "Amazing" },
      { index: 4, name: "Great" },
      { index: 2, name: "Meh" },
      { index: 1, name: "Slightly better" },
      { index: 0, name: "Not so great" },
    ];

    const categoryLevelCounts = [
      {
        category: { name: "Service Ownership" },
        level: { name: "Amazing" },
        serviceCount: 5,
      },
      {
        category: { name: "Service Ownership" },
        level: { name: "Meh" },
        serviceCount: 2,
      },
      {
        category: { name: "Reliability" },
        level: { name: "Amazing" },
        serviceCount: 3,
      },
      {
        category: { name: "Reliability" },
        level: { name: "Not so great" },
        serviceCount: 4,
      },
    ];
    bandaidsForApexCharts();

    render(
      <OverallMaturityCategoryBreakdown
        loading={false}
        levels={levels}
        categoryLevelCounts={categoryLevelCounts}
      />,
    );



    // It renders the card's title
    expect(screen.getByText("Category Breakdown")).toBeVisible();

    // It contains the level information
    expect(screen.getByText("Amazing")).toBeVisible();
    expect(screen.getByText("Meh")).toBeVisible();
    expect(screen.getByText("Not so great")).toBeVisible();
  });
});
