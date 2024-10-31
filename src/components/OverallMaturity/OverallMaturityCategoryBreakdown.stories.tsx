import type { Meta, StoryObj } from "@storybook/react";

import { OverallMaturityCategoryBreakdown } from "./OverallMaturityCategoryBreakdown";

const meta: Meta<typeof OverallMaturityCategoryBreakdown> = {
  title: "OverallMaturityCategoryBreakdown",
  component: OverallMaturityCategoryBreakdown,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {
    loading: true,
    levels: [],
    categoryLevelCounts: [],
    theme: {
      palette: { text: {} },
    },
  },
};

export const WithData: Story = {
  args: {
    loading: false,
    levels: [
      { name: "Amazing" },
      { name: "Great" },
      { name: "Meh" },
      { name: "Slightly better" },
      { name: "Not so great" },
    ],
    categoryLevelCounts: [
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
    ],
    theme: {
      palette: { text: {} },
    },
  },
};
