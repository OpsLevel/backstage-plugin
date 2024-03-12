import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CampaignSummary from "../components/CampaignSummary";

describe("CampaignSummary", () => {
  it("shows passing campaigns", () => {
    const campaignByService = {
      campaign: {
        id: '1',
        name: 'Campaign Name',
        status: 'delayed',
      }
      
    };

    render(
      <CampaignSummary
      campaignByService={campaignByService}
      />,
    );

    expect(screen.getByText(title)).toBeInTheDocument();
  });
});
