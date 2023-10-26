import type { Meta, StoryObj } from '@storybook/react';

import { SnackAlert } from './SnackAlert';
import React from 'react';
import { useState } from 'react';

const meta = {
  title: 'SnackAlert',
  component: SnackAlert,
} satisfies Meta<typeof SnackAlert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PersistentError: Story = {
  args: {
    message: "Some snack alert message",
    severity: 'error',
    open: true,
  },
};

const DynamicSnackAlert = (): React.ReactElement => {
  const [isOpen, setIsOpen] = useState(true);

  return <SnackAlert message="Some snack message" duration={2000} severity="info" setOpen={() => setIsOpen(false)} open={isOpen} />;
};

export const TemporaryMessage = {
  render: () => (<DynamicSnackAlert />)
};