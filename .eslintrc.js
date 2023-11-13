const cliConfig = require('@backstage/cli/config/eslint-factory')(__dirname);

module.exports = {
  ...cliConfig,
    "extends": [
      "airbnb",
      "airbnb/hooks",
      'eslint:recommended',
      "plugin:eslint-comments/recommended",
      'plugin:import/recommended',
      "plugin:import/typescript",
      "plugin:jsx-a11y/recommended",
      "plugin:react/recommended",
      "prettier",
      "prettier/prettier",
      "plugin:prettier/recommended",
    ],
    "plugins": [
      'jsx-a11y',
      "react",
      '@typescript-eslint/eslint-plugin',
    ],
  rules: {
    ...cliConfig.rules,
    "eslint-comments/require-description": "error",
    "curly": ["error", "all"],
    "no-unused-vars": "off", // Typescript has its own rule for unused vars
    "@typescript-eslint/no-unused-vars": ["error"],
    "react/no-danger": ["error"], // This is only a warning by default and we should not allow it without a written exception
    "react/jsx-filename-extension": ["error", { "extensions": [".tsx"] }],
    // TODO: Disabled rules that should be on
    "react-hooks/exhaustive-deps": ["off"],
    "import/extensions": ["off"], // This just requires a lot of manual work
    "jsx-a11y/anchor-is-valid": ["off"], // We need to switch these to buttons for a11y
    "react/require-default-props": ["off"], // Requires some manual work
    "react/destructuring-assignment": ["off"], // This rule seems pointless to me but mostly disappears once we ditch class components
    "class-methods-use-this": ["off"], // They're not wrong but we should just ditch classes and then consider these things
    "react/jsx-props-no-spreading": ["off"], // We'll fix this but it requires shifting around wrappers a little for service errors
    "react/jsx-no-bind": ["off"], // We'll fix this but it requires shifting around wrappers a little for service errors
    "no-restricted-syntax": ["off"], // These are dangerous but require some logic evaluation so I want to do it separately
    "no-continue": ["off"], // These are dangerous but require some logic evaluation so I want to do it separately
    "no-plusplus": ["off"], // These are dangerous but require some logic evaluation so I want to do it separately
    "react/no-array-index-key": ["off"], // This should be fixable now that we pass index to level, but needs evaluation
    "react/no-unescaped-entities": ["off"], // Easy fix but is UI impacting so I want to make sure we do it right
    "jsx-a11y/click-events-have-key-events": ["off"], // Requires some manual validation and thought for a11y
    "jsx-a11y/no-static-element-interactions": ["off"], // Requires some manual validation and thought for a11y
    // TODO: Disabled rules that will be fixed as part of this ticket in a follow on PR
    'react/no-unstable-nested-components': 'off',
  },
};
