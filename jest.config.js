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
    "<rootDir>/node_modules/(?!(@backstage|react-syntax-highlighter|@ts-stack|react-js-cron|d3-zoom|uuid)/)",
  ],
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx|mjs)$": "babel-jest",
  },
};

module.exports = config;
