import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { OverallLevel } from './OverallLevel';

const meta = {
  title: 'OverallLevel',
  component: OverallLevel,
} satisfies Meta<typeof OverallLevel>;

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
    maturityReport: {
      categoryBreakdown: [{
        category: {
          name: "Ownership"
        },
        level: {
          name: 'Beginner'
        }
      },
      {
        category: {
          name: "Reliability"
        },
        level: {
          name: 'Bronze'
        }
      }
      ],
      overallLevel: {
        description: "Services in this level are below the minimum standard to ship to production. You should address your failing checks as soon as possible.",
        index: 0,
        name: "Beginner",
      }
    }
  },
};