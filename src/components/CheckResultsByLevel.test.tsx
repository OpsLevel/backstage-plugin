import React from "react";
import { screen } from "@testing-library/react";
import {
  MockConfigApi,
  TestApiProvider,
  renderInTestApp,
} from "@backstage/test-utils";
import { configApiRef } from "@backstage/core-plugin-api";
import CheckResultsByLevel from "./CheckResultsByLevel";
import { LevelCheckResults } from "../types/OpsLevelData";

const mockConfig = new MockConfigApi({
  opslevel: { baseUrl: "https://example.com" },
});

describe("CheckResultsByLevel", () => {
  const getCheckResultsByLevelData = (): Array<LevelCheckResults> => [
    {
      level: {
        index: 1,
        name: "Bronze",
      },
      items: {
        nodes: [
          {
            message: "This check has status failed.",
            warnMessage: "Something went wrong",
            createdAt: "2023-05-11T20:47:53.869313Z",
            check: {
              id: "1",
              type: "generic",
              enableOn: null,
              name: "Status: failed",
              category: {
                id: "id_1",
                name: "Service Ownership",
                container: {
                  href: "https://example.com",
                },
              },
              owner: null,
            },
            status: "failed",
          },
        ],
      },
    },
    {
      level: {
        index: 3,
        name: "Gold",
      },
      items: {
        nodes: [
          {
            message: "This check has status pending.",
            warnMessage: null,
            createdAt: "2023-05-11T20:47:53.869313Z",
            check: {
              id: "2",
              type: "custom",
              enableOn: null,
              name: "Status: pending",
              category: {
                id: "id_1",
                name: "Service Ownership",
                container: {
                  href: "https://example.com",
                },
              },
              owner: null,
            },
            status: "pending",
          },
          {
            message: "This check has status passed.",
            warnMessage: null,
            createdAt: "2023-05-11T20:47:53.869313Z",
            check: {
              id: "3",
              type: "manual",
              enableOn: null,
              name: "Status: passed",
              category: null,
              owner: null,
            },
            status: "passed",
          },
        ],
      },
    },
    {
      level: {
        index: 4,
        name: "very long level name",
      },
      items: {
        nodes: [
          {
            message: "This check has status upcoming_failed.",
            warnMessage: null,
            createdAt: "2023-05-11T20:47:53.869313Z",
            check: {
              id: "4",
              type: "generic",
              enableOn: "2023-05-11T20:47:53.869313Z",
              name: "Status: upcoming_failed",
              category: {
                id: "id_1",
                name: "Service Ownership",
                container: {
                  href: "https://example.com",
                },
              },
              owner: null,
            },
            status: "failed",
          },
          {
            message: "This check has status upcoming_pending.",
            warnMessage: null,
            createdAt: "2023-05-11T20:47:53.869313Z",
            check: {
              id: "5",
              type: "manual",
              enableOn: "2023-05-11T20:47:53.869313Z",
              name: "Status: upcoming_pending",
              category: {
                id: "id_1",
                name: "Service Ownership",
                container: {
                  href: "https://example.com",
                },
              },
              owner: null,
            },
            status: "pending",
          },
          {
            message: "This check has status upcoming_passed.",
            warnMessage: null,
            createdAt: "2023-05-11T20:47:53.869313Z",
            check: {
              id: "6",
              type: "manual",
              enableOn: "2023-05-11T20:47:53.869313Z",
              name: "Status: upcoming_passed",
              category: {
                id: "id_1",
                name: "Service Ownership",
                container: {
                  href: "https://example.com",
                },
              },
              owner: null,
            },
            status: "passed",
          },
        ],
      },
    },
    {
      level: {
        index: 5,
        name: "and another one",
      },
      items: {
        nodes: [],
      },
    },
  ];

  const renderComponent = (
    data: Array<LevelCheckResults>,
    totalChecks: number,
    passingChecks: number,
  ) =>
    renderInTestApp(
      <TestApiProvider apis={[[configApiRef, mockConfig]]}>
        <CheckResultsByLevel
          checkResultsByLevel={data}
          totalChecks={totalChecks}
          totalPassingChecks={passingChecks}
        />
      </TestApiProvider>,
    );

  it("renders the header check correctly when things make sense", async () => {
    await renderComponent(getCheckResultsByLevelData(), 4, 2);

    expect(
      screen.getByText("Total Checks Passing: 2 / 4 (50%)"),
    ).toBeInTheDocument();
  });

  it("renders the header check correctly when things do not make sense", async () => {
    await renderComponent(getCheckResultsByLevelData(), 0, -7);
    expect(
      screen.getByText("Total Checks Passing: -7 / 0 (100%)"),
    ).toBeInTheDocument();
  });

  function expectHeaderValues(
    header: HTMLElement | undefined,
    passing: number,
    failing: number,
    pending?: number,
  ) {
    const childNodes = header?.parentElement?.childNodes;
    const isPendingIncluded = pending !== undefined;
    // Pending is the last item if it's there, otherwise the last item is failing
    expect(childNodes?.[2]?.textContent).toEqual(`${passing}`);
    expect(
      childNodes?.[(childNodes?.length ?? 0) - 1 - (isPendingIncluded ? 2 : 0)]
        ?.textContent,
    ).toEqual(`${failing}`);
    if (isPendingIncluded) {
      expect(childNodes?.[(childNodes?.length ?? 0) - 1]?.textContent).toEqual(
        `${pending}`,
      );
    }
  }

  it("renders the right level headers", async () => {
    await renderComponent(getCheckResultsByLevelData(), 4, 2);

    const checkSummaries = await Promise.all(
      getCheckResultsByLevelData().map(async (levelWrapper) => {
        return screen.getByText(levelWrapper.level.name, {
          exact: false,
        });
      }),
    );
    const bronzeLevelHeader = checkSummaries.at(0);
    expect(bronzeLevelHeader?.textContent).toEqual("Bronze (1)");
    expectHeaderValues(bronzeLevelHeader, 1, 0);

    const goldLevelHeader = checkSummaries.at(1);
    expect(goldLevelHeader?.textContent).toEqual("Gold (2)");
    expectHeaderValues(goldLevelHeader, 1, 0, 1);

    const longLevelHeader = checkSummaries.at(2);
    expect(longLevelHeader?.textContent).toEqual("very long level name (3)");
    expectHeaderValues(longLevelHeader, 3, 0, 0);

    const anotherLevelHeader = checkSummaries.at(3);
    expect(anotherLevelHeader?.textContent).toEqual("and another one (0)");
    expectHeaderValues(anotherLevelHeader, 0, 0);
  });

  it("automatically expands a level if it has pending checks", async () => {
    const input = getCheckResultsByLevelData();
    input[0].items.nodes[0].status = "passed";

    await renderComponent(input, 4, 2);

    const checkSummaries = await Promise.all(
      input.map(async (levelWrapper) => {
        return screen.getByText(levelWrapper.level.name, {
          exact: false,
        });
      }),
    );
    const goldLevelHeader = checkSummaries.at(1);
    expect(goldLevelHeader?.closest("[role='button']")?.classList).toContain(
      "Mui-expanded",
    );
  });
});
