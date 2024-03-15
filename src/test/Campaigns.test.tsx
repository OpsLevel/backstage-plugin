import React from "react";
import { render, screen } from "@testing-library/react";
import {
  MockConfigApi,
  TestApiProvider,
  wrapInTestApp,
} from "@backstage/test-utils";
import { configApiRef } from "@backstage/core-plugin-api";
import { opslevelApiRef } from "../api";
import { ChecksByCampaign } from "../types/OpsLevelData";
import Campaigns from "../components/Campaigns";

const getMockConfig = () =>
  new MockConfigApi({
    opslevel: { baseUrl: "https://example.com" },
    backend: { baseUrl: "https://backend.com" },
  });

const getMockOpsLevelConfig = () => ({
  url: "https://opslevel.com",
  getServiceMaturityByAlias: jest.fn(),
  getCampaigns: jest.fn(),
  exportEntity: jest.fn(),
  getServicesReport: jest.fn(),
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

describe("Campaigns", () => {
  it("shows campaigns", async () => {
    const serviceId = "123";
    const checksByCampaign = getChecksByCampaign();

    const mockOpsLevelConfig = getMockOpsLevelConfig();
    mockOpsLevelConfig.getCampaigns.mockImplementationOnce(() =>
      Promise.resolve({
        account: {
          service: {
            campaignReport: {
              checkResultsByCampaign: { nodes: [checksByCampaign] },
            },
          },
        },
      }),
    );

    render(
      wrapInTestApp(
        <TestApiProvider
          apis={[
            [configApiRef, getMockConfig()],
            [opslevelApiRef, mockOpsLevelConfig],
          ]}
        >
          <Campaigns serviceId={serviceId} />
        </TestApiProvider>,
      ),
    );

    expect(mockOpsLevelConfig.getCampaigns).toHaveBeenCalledWith(serviceId);

    expect(await screen.findByText("Campaigns")).toBeInTheDocument();
    expect(
      await screen.findByText(checksByCampaign.campaign!.name),
    ).toBeInTheDocument();
  });

  it("shows nothing if there are no campaigns", async () => {
    const serviceId = "123";

    const mockOpsLevelConfig = getMockOpsLevelConfig();
    mockOpsLevelConfig.getCampaigns.mockImplementationOnce(() =>
      Promise.resolve({
        account: {
          service: {
            campaignReport: {
              checkResultsByCampaign: { nodes: [] },
            },
          },
        },
      }),
    );

    render(
      wrapInTestApp(
        <TestApiProvider
          apis={[
            [configApiRef, getMockConfig()],
            [opslevelApiRef, mockOpsLevelConfig],
          ]}
        >
          <Campaigns serviceId={serviceId} />
        </TestApiProvider>,
      ),
    );

    expect(mockOpsLevelConfig.getCampaigns).toHaveBeenCalledWith(serviceId);

    expect(await screen.queryByText("Campaigns")).not.toBeInTheDocument();
  });
});
