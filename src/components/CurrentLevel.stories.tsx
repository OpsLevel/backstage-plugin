import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { CurrentLevel } from './CurrentLevel';

const meta = {
  title: 'CurrentLevel',
  component: CurrentLevel,
} satisfies Meta<typeof CurrentLevel>;

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
    overallLevel: {
      description: "Services in this level are below the minimum standard to ship to production. You should address your failing checks as soon as possible.",
      index: 0,
      name: "Beginner",
    }
  },
};