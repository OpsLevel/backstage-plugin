import React from "react";
import { screen, within } from "@testing-library/react";
import {
  MockConfigApi,
  renderInTestApp,
  TestApiProvider,
} from "@backstage/test-utils";
import { configApiRef } from "@backstage/core-plugin-api";
import CheckResultDetails from "./CheckResultDetails";
import { CheckResult, CheckResultStatus } from "../types/OpsLevelData";

const mockConfig = new MockConfigApi({
  opslevel: { baseUrl: "https://example.com" },
});

type CheckResultWithUpcoming = Omit<CheckResult, "status"> & {
  status: CheckResultStatus;
};

const getCheckResult = (
  status: CheckResultStatus,
): CheckResultWithUpcoming => ({
  message: `This check has status ${status}.`,
  warnMessage: "Something went wrong",
  createdAt: "2023-05-11T20:47:53.869313Z",
  check: {
    id: "1",
    type: "has_owner",
    enableOn: null,
    name: `Status: ${status}`,
    category: null,
    owner: null,
  },
  status,
});

const customRender = async (component: React.JSX.Element) => {
  return renderInTestApp(
    <TestApiProvider apis={[[configApiRef, mockConfig]]}>
      {component}
    </TestApiProvider>,
  );
};

describe("CheckResultDetails", () => {
  it("renders a check with baseline information", async () => {
    const checkResult = getCheckResult("failed");
    checkResult.createdAt = "2023-05-11T20:47:53.869313Z";

    await customRender(
      <CheckResultDetails checkResult={checkResult} combinedStatus="failed" />,
    );

    const header = screen.getByRole("button");

    expect(
      within(header).getByText(checkResult.check.name),
    ).toBeInTheDocument();

    expect(
      screen.getByText("May 11th 2023, 20:47:53 (UTC)"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(checkResult.warnMessage as string),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        "We were unable to fully parse the result message due to the following Liquid errors:",
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        "Please fix and resend a payload to see an updated check result message.",
      ),
    ).not.toBeInTheDocument();
  });

  it("renders a payload check with payload details", async () => {
    const checkResult = getCheckResult("failed");
    checkResult.check.type = "payload";

    await customRender(
      <CheckResultDetails checkResult={checkResult} combinedStatus="failed" />,
    );

    expect(
      screen.getByText(checkResult.warnMessage as string),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "We were unable to fully parse the result message due to the following Liquid errors:",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Please fix and resend a payload to see an updated check result message.",
      ),
    ).toBeInTheDocument();
  });

  it("shows the category with link", async () => {
    const categoryName = "Pumas";
    const categoryHref = "/services/cats";
    const checkResult = getCheckResult("failed");
    checkResult.check.category = {
      id: "1989",
      name: categoryName,
      container: {
        href: categoryHref,
      },
    };

    await customRender(
      <CheckResultDetails checkResult={checkResult} combinedStatus="failed" />,
    );

    const header = screen.getByRole("button");

    expect(within(header).getByText(categoryName)).toBeInTheDocument();
    expect(within(header).getByText(categoryName).getAttribute("href")).toBe(
      `https://example.com${categoryHref}`,
    );
    expect(within(header).getByLabelText("table")).toBeInTheDocument();
  });

  it("shows the owner with link", async () => {
    const ownerName = "Ninja";
    const ownerHref = "/teams/ninja";
    const checkResult = getCheckResult("failed");
    checkResult.check.owner = {
      name: ownerName,
      href: ownerHref,
    };

    await customRender(
      <CheckResultDetails checkResult={checkResult} combinedStatus="failed" />,
    );

    const header = screen.getByRole("button");

    expect(within(header).getByText(ownerName)).toBeInTheDocument();
    expect(within(header).getByText(ownerName).getAttribute("href")).toBe(
      `https://example.com${ownerHref}`,
    );
    expect(within(header).getByLabelText("team")).toBeInTheDocument();
  });

  it("renders a generic check with payload details", async () => {
    const checkResult = getCheckResult("failed");
    checkResult.check.type = "generic";

    await customRender(
      <CheckResultDetails checkResult={checkResult} combinedStatus="failed" />,
    );

    expect(
      screen.getByText(checkResult.warnMessage as string),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "We were unable to fully parse the result message due to the following Liquid errors:",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Please fix and resend a payload to see an updated check result message.",
      ),
    ).toBeInTheDocument();
  });

  it("renders a failing check in the right color", async () => {
    await customRender(
      <CheckResultDetails
        checkResult={getCheckResult("failed")}
        combinedStatus="failed"
      />,
    );

    expect(screen.getByRole("button").parentNode).toHaveStyle({
      backgroundColor: "#ff000033",
    });
  });

  it("renders a pending check in the right color", async () => {
    await customRender(
      <CheckResultDetails
        checkResult={getCheckResult("pending")}
        combinedStatus="pending"
      />,
    );

    expect(screen.getByRole("button").parentNode).toHaveStyle({
      backgroundColor: "#ffff0033",
    });
  });

  it("renders a passed check in the right color", async () => {
    await customRender(
      <CheckResultDetails
        checkResult={getCheckResult("passed")}
        combinedStatus="passed"
      />,
    );

    expect(screen.getByRole("button").parentNode).toHaveStyle({
      backgroundColor: "#00ff0033",
    });
  });

  it("renders an upcoming_failed check in the right color with an upcoming message", async () => {
    await customRender(
      <CheckResultDetails
        checkResult={getCheckResult("upcoming_failed")}
        combinedStatus="upcoming_failed"
      />,
    );

    expect(
      screen.getByText("This check has status upcoming_failed."),
    ).toBeInTheDocument();
    expect(
      screen.getByText(", but it is currently failing."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button").parentNode).toHaveStyle({
      backgroundColor: "#00000033",
    });
  });

  it("renders an upcoming_pending check in the right color with an upcoming message", async () => {
    await customRender(
      <CheckResultDetails
        checkResult={getCheckResult("upcoming_pending")}
        combinedStatus="upcoming_pending"
      />,
    );

    expect(
      screen.getByText("This check has status upcoming_pending."),
    ).toBeInTheDocument();
    expect(
      screen.getByText(", but it has not been evaluated yet."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button").parentNode).toHaveStyle({
      backgroundColor: "#00000033",
    });
  });

  it("renders an upcoming_passed check in the right color with an upcoming message", async () => {
    await customRender(
      <CheckResultDetails
        checkResult={getCheckResult("upcoming_passed")}
        combinedStatus="upcoming_passed"
      />,
    );

    expect(
      screen.getByText("This check has status upcoming_passed."),
    ).toBeInTheDocument();
    expect(
      screen.getByText(", but it is currently passing."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button").parentNode).toHaveStyle({
      backgroundColor: "#00000033",
    });
  });

  it("expands upcoming failing tests", async () => {
    await customRender(
      <CheckResultDetails
        checkResult={getCheckResult("upcoming_failed")}
        combinedStatus="upcoming_failed"
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Status: upcoming_failed",
        expanded: true,
      }),
    ).toHaveClass("Mui-expanded");
  });

  it("expands failing tests", async () => {
    await customRender(
      <CheckResultDetails
        checkResult={getCheckResult("failed")}
        combinedStatus="failed"
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Status: failed",
        expanded: true,
      }),
    ).toHaveClass("Mui-expanded");
  });

  it("does not expand passing tests", async () => {
    await customRender(
      <CheckResultDetails
        checkResult={getCheckResult("passed")}
        combinedStatus="passed"
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Status: passed",
        expanded: false,
      }),
    ).not.toHaveClass("Mui-expanded");
  });

  it("shows a table icon for categories", async () => {
    const checkResult = getCheckResult("failed");
    checkResult.check.category = {
      id: "1989",
      name: "Tigers",
      container: {
        href: "/services/cats",
      },
    };

    await customRender(
      <CheckResultDetails checkResult={checkResult} combinedStatus="passed" />,
    );

    expect(screen.getByLabelText("table")).toBeInTheDocument();
    expect(screen.queryByLabelText("file-done")).not.toBeInTheDocument();
  });

  it("shows a file-done icon for scorecards", async () => {
    const checkResult = getCheckResult("failed");
    checkResult.check.isScorecardCheck = true;
    checkResult.check.category = {
      id: "1989",
      name: "Tigers",
      container: {
        href: "/services/cats",
      },
    };

    await customRender(
      <CheckResultDetails checkResult={checkResult} combinedStatus="passed" />,
    );

    expect(screen.queryByLabelText("table")).not.toBeInTheDocument();
    expect(screen.getByLabelText("file-done")).toBeInTheDocument();
  });
});
