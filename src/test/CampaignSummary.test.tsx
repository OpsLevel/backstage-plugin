import React from "react";
import { render, screen } from "@testing-library/react";
import { wrapInTestApp } from "@backstage/test-utils";
import CampaignSummary from "../components/CampaignSummary";
import { ChecksByCampaign } from "../types/OpsLevelData";

describe("CampaignSummary", () => {
  it("shows passing campaigns", () => {
    const campaignByService = {
      campaign: {
        owner: {
          id: "1",
          name: "Team name",
          href: "http://opslevel.com/teams/8",
        },
        id: "49",
        name: "Campaign Name",
        href: "http://opslevel.com/campaigns/49",
        startDate: null,
        targetDate: null,
        endedDate: null,
        status: "in_progress",
      },
      status: "passing",
    } as ChecksByCampaign;

    render(
      wrapInTestApp(<CampaignSummary campaignByService={campaignByService} />),
    );

    expect(
      screen.getByText(campaignByService.campaign?.name!),
    ).toBeInTheDocument();
  });
});
