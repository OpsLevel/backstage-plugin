import React from "react";
import { render, screen } from "@testing-library/react";
import ThemedOverallMaturityCategoryBreakdown from "./OverallMaturityCategoryBreakdown";

jest.mock("react-apexcharts", () => {
  return {
    __esModule: true,
    default: () => {
      return <div id="apex-charts">Apex Charts</div>;
    },
  };
});
describe("OverallMaturityCategoryBreakdown", () => {
  it("renders a progress bar in loading mode", () => {
    render(
      <ThemedOverallMaturityCategoryBreakdown
        loading
        levels={[]}
        categoryLevelCounts={[]}
      />,
    );

    // It renders the card's title
    expect(screen.getByText("Category Breakdown")).toBeVisible();

    // It doesn't render a chart
    expect(document.querySelectorAll("svg").length).toEqual(0);
  });

  it("renders a bar chart when there is data", () => {
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

    render(
      <ThemedOverallMaturityCategoryBreakdown
        loading={false}
        levels={levels}
        categoryLevelCounts={categoryLevelCounts}
      />,
    );

    // It renders the card's title
    expect(screen.getByText("Category Breakdown")).toBeVisible();

    // It renders the chart
    expect(screen.getByText("Apex Charts")).toBeVisible();
  });
});
