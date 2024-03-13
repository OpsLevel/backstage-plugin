import React from "react";
import { render, screen } from "@testing-library/react";
import {
  MockConfigApi,
  TestApiProvider,
  wrapInTestApp,
} from "@backstage/test-utils";
import { configApiRef } from "@backstage/core-plugin-api";
import CampaignSummary from "../components/CampaignSummary";
import { ChecksByCampaign } from "../types/OpsLevelData";

const getMockConfig = () =>
  new MockConfigApi({
    opslevel: { baseUrl: "https://example.com" },
  });

const getChecksByCampaign = (): ChecksByCampaign => {
  return {
    campaign: {
      owner: {
        id: "1",
        name: "Team name",
        href: "/teams/8",
      },
      id: "49",
      name: "Campaign Name",
      href: "/campaigns/49",
      startDate: null,
      targetDate: null,
      endedDate: null,
      status: "in_progress",
    },
    items: {
      nodes: [
        {
          message: "Message",
          warnMessage: null,
          createdAt: "2022-03-01T00:00:00.000Z",
          status: "failed",
          check: {
            id: "1",
            enableOn: null,
            name: "check name",
            type: "type",
            owner: null,
            category: null,
          },
        },
      ],
    },
    status: "passing",
  };
};

describe("CampaignSummary", () => {
  it("shows passing campaigns", async () => {
    const campaignByService = getChecksByCampaign();
    render(
      wrapInTestApp(
        <TestApiProvider apis={[[configApiRef, getMockConfig()]]}>
          <CampaignSummary campaignByService={campaignByService} />
        </TestApiProvider>,
      ),
    );

    expect(
      await screen.findByText(campaignByService.campaign?.name!),
    ).toBeInTheDocument();
    expect(
      await screen.queryByTitle("Failing Campaign Icon"),
    ).not.toBeInTheDocument();
    expect(
      await screen.findByTitle("Passing Campaign Icon"),
    ).toBeInTheDocument();
  });

  it("shows failing campaigns", async () => {
    const campaignByService = getChecksByCampaign();
    campaignByService.status = "failing";
    render(
      wrapInTestApp(
        <TestApiProvider apis={[[configApiRef, getMockConfig()]]}>
          <CampaignSummary campaignByService={campaignByService} />
        </TestApiProvider>,
      ),
    );

    expect(
      await screen.findByText(campaignByService.campaign?.name!),
    ).toBeInTheDocument();
    expect(
      await screen.findByTitle("Failing Campaign Icon"),
    ).toBeInTheDocument();
    expect(
      await screen.queryByTitle("Passing Campaign Icon"),
    ).not.toBeInTheDocument();
  });

  it("shows campaign details", async () => {
    const campaignByService = getChecksByCampaign();
    campaignByService.campaign!.startDate = "2020-01-01T00:00:00.000Z";
    campaignByService.campaign!.targetDate = "2022-03-01T00:00:00.000Z";

    render(
      wrapInTestApp(
        <TestApiProvider apis={[[configApiRef, getMockConfig()]]}>
          <CampaignSummary campaignByService={campaignByService} />
        </TestApiProvider>,
      ),
    );

    expect(
      await screen.findByRole("link", {
        name: campaignByService.campaign?.owner?.name,
      }),
    ).toHaveAttribute("href", "https://example.com/teams/8");
    expect(
      (await screen.findByTitle("Failing Checks Icon")).parentElement
        ?.parentNode?.textContent,
    ).toEqual("Failing Checks Icon1");
    expect(
      (await screen.findByTitle("Passing Checks Icon")).parentElement
        ?.parentNode?.textContent,
    ).toEqual("Passing Checks Icon0");
    expect((await screen.findByText(`Status:`))?.textContent).toEqual(
      "Status: In progress",
    );
    expect(
      (await screen.findByText(`Start Date:`, { exact: false }))?.textContent,
    ).toEqual("Start Date: January 1st 2020 (UTC)");
    expect(
      (await screen.findByText(`Target Date:`, { exact: false }))?.textContent,
    ).toEqual("Target Date: March 1st 2022 (UTC)");
  });

  it("allows linking to details", async () => {
    const campaignByService = getChecksByCampaign();
    campaignByService.campaign!.href = "/campaigns/99";

    render(
      wrapInTestApp(
        <TestApiProvider apis={[[configApiRef, getMockConfig()]]}>
          <CampaignSummary campaignByService={campaignByService} />
        </TestApiProvider>,
      ),
    );

    expect(
      await screen.findByRole("link", { name: "See Details" }),
    ).toHaveAttribute("href", "https://example.com/campaigns/99");
  });
});
