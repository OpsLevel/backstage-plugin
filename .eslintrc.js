const cliConfig = require('@backstage/cli/config/eslint-factory')(__dirname);

module.exports = {
  ...cliConfig,
  rules: {
    ...cliConfig.rules,
    "indent": ["error", 2],
    "react-hooks/exhaustive-deps": ["off"],
  }
};
