import type { Meta, StoryObj } from '@storybook/react';
import ServiceMaturitySidebar from './ServiceMaturitySidebar';

const meta = {
  title: 'Service Maturity Sidebar',
  component: ServiceMaturitySidebar,
} satisfies Meta<typeof ServiceMaturitySidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    overallLevel: {
      index: 3,
      name: 'Good',
      description: 'Your services are on their way but still can be better. Primarily, you should be focused on styling and maintainability now that security concerns are out of the way.'
    },
    levels: [{index: 0, name: "Not so great"}, {index: 1, name: "Good"}, {index: 3, name: "Great"}, {index: 4, name: "Amazing"}],
    levelCategories: [
      {level: {name: "Amazing"}, category: {name: "Ownership"}},
      {level: {name: "Good"}, category: {name: "Reliability"}},
      {level: null, category: {name: "Security"}},
      {level: {name: "Great"}, category: {name: "Observability"}},
    ]
  },
};

export const WithScorecards: Story = {
  args: {
    scorecardCategories: [
      {level: {name: "Not so great"}, category: {name: "Back-End Scorecard"}},
      {level: {name: "Amazing"}, category: {name: "Front-End Scorecard"}},
      {level: null, category: {name: "Team Bravo Services"}},
    ],
    overallLevel: {
      index: 3,
      name: 'Good',
      description: 'Your services are on their way but still can be better. Primarily, you should be focused on styling and maintainability now that security concerns are out of the way.'
    },
    levels: [{index: 0, name: "Not so great"}, {index: 1, name: "Good"}, {index: 3, name: "Great"}, {index: 4, name: "Amazing"}],
    levelCategories: [
      {level: {name: "Amazing"}, category: {name: "Ownership"}},
      {level: {name: "Good"}, category: {name: "Reliability"}},
      {level: null, category: {name: "Security"}},
      {level: {name: "Great"}, category: {name: "Observability"}},
    ]
  },
};