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
    scorecardCategories: [],
    levelCategories: [
      {level: {name: "Amazing"}, category: {id: "1", name: "Ownership"}},
      {level: {name: "Good"}, category: {id: "2", name: "Reliability"}},
      {level: null, category: {id: "3", name: "Security"}},
      {level: {name: "Great"}, category: {id: "4", name: "Observability"}},
    ],
    selectedCategoryIds: [],
    onCategorySelectionChanged: () => {},
  },
};

export const WithScorecards: Story = {
  args: {
    scorecardCategories: [
      {level: {name: "Not so great"}, category: {id: "1", name: "Back-End Scorecard"}},
      {level: {name: "Amazing"}, category: {id: "2", name: "Front-End Scorecard"}},
      {level: null, category: {id: "3", name: "Team Bravo Services"}},
    ],
    overallLevel: {
      index: 3,
      name: 'Good',
      description: 'Your services are on their way but still can be better. Primarily, you should be focused on styling and maintainability now that security concerns are out of the way.'
    },
    levels: [{index: 0, name: "Not so great"}, {index: 1, name: "Good"}, {index: 3, name: "Great"}, {index: 4, name: "Amazing"}],
    levelCategories: [
      {level: {name: "Amazing"}, category: {id: "1", name: "Ownership"}},
      {level: {name: "Good"}, category: {id: "2", name: "Reliability"}},
      {level: null, category: {id: "3", name: "Security"}},
      {level: {name: "Great"}, category: {id: "4", name: "Observability"}},
    ],
    selectedCategoryIds: [],
    onCategorySelectionChanged: () => {},
  },
};