import type { Meta, StoryObj } from '@storybook/react';

import Scorecard from './Scorecard';
import React from 'react';

const meta = {
  title: 'Scorecard',
  component: Scorecard,
} satisfies Meta<typeof Scorecard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '400px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    title: "Scorecard",
    levels: [{index: 0, name: "Not so great"}, {index: 1, name: "Slightly better"}, {index: 3, name: "Great"}, {index: 4, name: "Amazing"}],
    levelCategories: [
      {level: {name: "Not so great"}, category: {name: "Ownership"}},
      {level: {name: "Slightly better"}, category: {name: "Reliability"}},
      {level: {name: "Great"}, category: {name: "Observability"}},
    ]
  },
};