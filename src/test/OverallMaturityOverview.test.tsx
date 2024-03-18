import React from "react";
import { render, screen } from "@testing-library/react";
import OverallMaturityOverview from "../components/OverallMaturityOverview";

describe("OverallMaturityOverview", () => {
  it("renders a progress bar in loading mode", () => {
    render(<OverallMaturityOverview loading levels={[]} levelCounts={[]} />);

    // It renders the card's title
    expect(screen.getByText("Overview")).toBeInTheDocument();

    // It doesn't render a chart
    expect(document.querySelectorAll("svg").length).toEqual(0);
  });

  it("renders a donut chart when there is data", () => {
    const levels = [
      { index: 5, name: "Amazing" },
      { index: 4, name: "Great" },
      { index: 2, name: "Meh" },
      { index: 1, name: "Slightly better" },
      { index: 0, name: "Not so great" },
    ];

    const levelCounts = [
      { level: { name: "Amazing" }, serviceCount: 5 },
      { level: { name: "Great" }, serviceCount: 3 },
      { level: { name: "Not so great" }, serviceCount: 2 },
    ];

    render(
      <OverallMaturityOverview
        loading={false}
        levels={levels}
        levelCounts={levelCounts}
      />,
    );

    // It renders the card's title
    expect(screen.getByText("Overview")).toBeInTheDocument();

    // It renders a chart canvas and legend
    expect(document.querySelectorAll("svg")).toHaveLength(2);
    expect(
      document.querySelectorAll("svg")[0].classList.contains("apexcharts-svg"),
    ).toBeTruthy();

    // It contains the level information
    expect(screen.getByText("Amazing (50%)")).toBeInTheDocument();
    expect(screen.getByText("Great (30%)")).toBeInTheDocument();
    expect(screen.getByText("Not so great (20%)")).toBeInTheDocument();
  });
});
