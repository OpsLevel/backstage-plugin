import type { Preview } from "@storybook/react";
import React from 'react';
import { lightTheme, darkTheme } from '@backstage/theme';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import {ThemeProvider} from "@material-ui/core";

export const withMuiTheme = (Story, context) => {
  const theme = context.parameters.theme || context.globals.theme
  const storyTheme = theme === 'dark' ? darkTheme : lightTheme
  return (
    <MUIThemeProvider theme={storyTheme}>
      <ThemeProvider theme={storyTheme}>
          <CssBaseline />
          <Story  />
      </ThemeProvider>
    </MUIThemeProvider>
  );
};

export const decorators = [withMuiTheme];

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      title: 'Theme',
      icon: 'circlehollow',
      items: [
        { value: 'light', icon: 'circlehollow', title: 'light' },
        { value: 'dark', icon: 'circle', title: 'dark' },
      ],
      showName: true,
    },
  },
}

export default preview;
