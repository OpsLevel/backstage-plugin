import type { Meta, StoryObj } from '@storybook/react';

import { CheckResultDetails } from './CheckResultDetails';

const meta = {
  title: 'CheckResultDetails',
  component: CheckResultDetails,
} satisfies Meta<typeof CheckResultDetails>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Passing: Story = {
  args: {
    combinedStatus: "passed",
    checkResult: {
      message: "Service is owned by team 'Bravo' which has a contact method of type 'SLACK'.",
      warnMessage: null,
      createdAt: `${new Date()}`,
      check: {
        id: '1',
        enableOn: null,
        name: 'Has Owner Defined',
        type: 'has_owner',
        category: {
          name: 'Quality'
        },
        owner: {
          name: 'Bravo'
        }
      },
      status: 'passed',
    }
  },
};

export const Failing: Story = {
  args: {
    combinedStatus: "failed",
    checkResult: {
      message: "No import linting is enabled",
      warnMessage: "Oh no, better fix it",
      createdAt: `${new Date()}`,
      check: {
        id: '1',
        enableOn: null,
        name: 'Linting is enabled',
        type: 'tool_usage',
        category: {
          name: 'Quality'
        },
        owner: null
      },
      status: 'failed',
    }
  },
};

export const Payload: Story = {
  args: {
    combinedStatus: "failed",
    checkResult: {
      message: "Ticket number 34 has caused the reduction from 76% to 72%.",
      warnMessage: "Health has dipped to 72%. The limit is 74%.",
      createdAt: `${new Date()}`,
      check: {
        id: '1',
        enableOn: null,
        name: 'Service health check is passing',
        type: 'payload',
        category: {
          name: 'Quality'
        },
        owner: null
      },
      status: 'failed',
    }
  },
};
