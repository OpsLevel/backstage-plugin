/** @type {import('jest').Config} */
const config = {
  rootDir: "../../../..",
  setupFilesAfterEnv: [
    "<rootDir>/test/textEncoder.js",
    "<rootDir>/test/jestImports.ts",
  ],
  testEnvironment: "jsdom",
  preset: "ts-jest",
  transformIgnorePatterns: [
    // We probably want to mock useStyles which will remove the need for all of this
    // "<rootDir>/node_modules/(?!(@backstage|react-markdown|react-syntax-highlighter|@ts-stack|bail|remark-parse|mdast-util-from-markdown|react-js-cron|d3-.*|trough|unified|unist-util-stringify-position|uuid|vfile.*)/)",
  ],
  moduleNameMapper: {
    "\\.(scss|svg|sass|css|less)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx|mjs)$": "babel-jest",
  },
};

module.exports = config;
