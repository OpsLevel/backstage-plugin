import { LevelCheckResults, ScorecardStats } from "../types/OpsLevelData";
import checksByLevelIncludingScorecards from "./checksByLevelIncludingScorecards";

function getScorecardStats(): ScorecardStats[] {
  return [
    {
      scorecard: {
        id: "Z2lkOi8vb3BzbGV2ZWwvUnVicmljLzM",
        name: "Scorecard 2",
        affectsOverallServiceLevels: false,
      },
      categories: {
        edges: [
          {
            level: {
              id: "Z2lkOi8vb3BzbGV2ZWwvTGV2ZWwvMTQ",
              index: 5,
              name: "Super Diamond Tier",
            },
            node: {
              id: "Z2lkOi8vb3BzbGV2ZWwvQ2F0ZWdvcnkvMTA",
              name: "Scorecard 2",
            },
          },
        ],
      },
      checkResults: {
        byLevel: {
          nodes: [
            {
              level: {
                index: 1,
                name: "🥉 Bronze",
              },
              items: {
                nodes: [
                  {
                    message:
                      "Service is owned by team 'logistics-coordination'.",
                    warnMessage: null,
                    createdAt: "2024-03-16T01:25:21.167583Z",
                    check: {
                      id: "Z2lkOi8vb3BzbGV2ZWwvQ2hlY2tzOjpIYXNPd25lci8yMw",
                      enableOn: null,
                      name: "Whatever test",
                      type: "has_owner",
                      category: {
                        id: "Z2lkOi8vb3BzbGV2ZWwvQ2F0ZWdvcnkvMTA",
                        name: "Scorecard 2",
                        container: {
                          href: "/scorecards/scorecard_2",
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
                name: "Super Diamond Tier",
              },
              items: {
                nodes: [],
              },
            },
          ],
        },
      },
    },
  ];
}

function getCheckResultsByLevel(): LevelCheckResults[] {
  return [
    {
      level: {
        index: 1,
        name: "🥉 Bronze",
      },
      items: {
        nodes: [
          {
            message: "The service does not have a language.",
            warnMessage: null,
            createdAt: "2024-03-16T01:25:20.296851Z",
            check: {
              id: "Z2lkOi8vb3BzbGV2ZWwvQ2hlY2tzOjpTZXJ2aWNlUHJvcGVydHkvNA",
              enableOn: null,
              name: "Service Language Defined",
              type: "service_property",
              category: {
                id: "Z2lkOi8vb3BzbGV2ZWwvQ2F0ZWdvcnkvMQ",
                name: "Service Ownership which shows how the service can be owned",
                container: {
                  href: "/rubrics",
                },
              },
              owner: null,
            },
            status: "failed",
          },
          {
            message: "The service has a description.",
            warnMessage: null,
            createdAt: "2024-03-16T01:25:20.222547Z",
            check: {
              id: "Z2lkOi8vb3BzbGV2ZWwvQ2hlY2tzOjpTZXJ2aWNlUHJvcGVydHkvMw",
              enableOn: null,
              name: "Service Description Defined",
              type: "service_property",
              category: {
                id: "Z2lkOi8vb3BzbGV2ZWwvQ2F0ZWdvcnkvNw",
                name: "Infrastructure",
                container: {
                  href: "/rubrics",
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
        name: "Super Diamond Tier",
      },
      items: {
        nodes: [
          {
            message:
              "The service does not have a tag with the key 'super-diamond'.",
            warnMessage: null,
            createdAt: "2024-03-16T01:25:23.894747Z",
            check: {
              id: "Z2lkOi8vb3BzbGV2ZWwvQ2hlY2tzOjpUYWdEZWZpbmVkLzY1",
              enableOn: null,
              name: "Tag with key 'super-diamond' defined",
              type: "tag_defined",
              category: {
                id: "Z2lkOi8vb3BzbGV2ZWwvQ2F0ZWdvcnkvMg",
                name: "Security",
                container: {
                  href: "/rubrics",
                },
              },
              owner: null,
            },
            status: "failed",
          },
          {
            message:
              "Service is owned by team 'logistics-coordination' which has a contact method of type 'ANY'.",
            warnMessage: null,
            createdAt: "2024-03-16T01:25:21.515002Z",
            check: {
              id: "Z2lkOi8vb3BzbGV2ZWwvQ2hlY2tzOjpIYXNPd25lci84OQ",
              enableOn: null,
              name: "Owner Exists with Contact",
              type: "has_owner",
              category: {
                id: "Z2lkOi8vb3BzbGV2ZWwvQ2F0ZWdvcnkvMQ",
                name: "Service Ownership which shows how the service can be owned",
                container: {
                  href: "/rubrics",
                },
              },
              owner: {
                name: "delete plz",
                href: "/teams/delete_plz",
              },
            },
            status: "passed",
          },
        ],
      },
    },
  ];
}

describe("checksByLevelIncludingScorecards", () => {
  it("gives an empty array if there are no checkResults", () => {
    const result = checksByLevelIncludingScorecards([]);

    expect(result).toEqual([]);
  });

  it("gives levelCheckResults filtered by selected categories", () => {
    const selectedCategories = ["Z2lkOi8vb3BzbGV2ZWwvQ2F0ZWdvcnkvMQ"];
    const checkResultsByLevel = getCheckResultsByLevel();
    const scorecardStats = getScorecardStats();

    const result = checksByLevelIncludingScorecards(
      selectedCategories,
      checkResultsByLevel,
      scorecardStats,
    );

    expect(result.length).toEqual(2);
    result.forEach((level) => {
      expect(level.items.nodes).toHaveLength(1);
      level.items.nodes.forEach((node) => {
        expect(node.check.category!.id).toEqual(
          "Z2lkOi8vb3BzbGV2ZWwvQ2F0ZWdvcnkvMQ",
        );
      });
    });
  });

  it("filters by selected categories when scorecards are empty", () => {
    const selectedCategories = ["Z2lkOi8vb3BzbGV2ZWwvQ2F0ZWdvcnkvMQ"];
    const checkResultsByLevel = getCheckResultsByLevel();

    const result = checksByLevelIncludingScorecards(
      selectedCategories,
      checkResultsByLevel,
    );

    expect(result.length).toEqual(2);
    result.forEach((level) => {
      level.items.nodes.forEach((node) => {
        expect(node.check.category!.id).toEqual(
          "Z2lkOi8vb3BzbGV2ZWwvQ2F0ZWdvcnkvMQ",
        );
      });
      expect(level.items.nodes).toHaveLength(1);
    });
  });

  it("gives levelCheckResults including scorecards", () => {
    const selectedCategories = [
      "Z2lkOi8vb3BzbGV2ZWwvQ2F0ZWdvcnkvMQ",
      "Z2lkOi8vb3BzbGV2ZWwvQ2F0ZWdvcnkvMTA",
    ];
    const checkResultsByLevel = getCheckResultsByLevel();
    const scorecardStats = getScorecardStats();

    const result = checksByLevelIncludingScorecards(
      selectedCategories,
      checkResultsByLevel,
      scorecardStats,
    );

    expect(result.length).toEqual(2);
    expect(result[0].items.nodes).toHaveLength(2);
    expect(result[1].items.nodes).toHaveLength(1);
    result.forEach((level) => {
      level.items.nodes.forEach((node) => {
        expect(
          selectedCategories.includes(node.check.category!.id),
        ).toBeTruthy();
      });
    });
  });

  it("leaves original checkResultsbyLevel untouched", () => {
    const selectedCategories = ["Z2lkOi8vb3BzbGV2ZWwvQ2F0ZWdvcnkvMQ"];
    const checkResultsByLevel = getCheckResultsByLevel();
    const scorecardStats = getScorecardStats();

    checksByLevelIncludingScorecards(
      selectedCategories,
      checkResultsByLevel,
      scorecardStats,
    );

    expect(checkResultsByLevel).toEqual(getCheckResultsByLevel());
  });
});
