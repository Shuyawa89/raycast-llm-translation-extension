module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@raycast/api$": "<rootDir>/__mocks__/@raycast/api.ts",
  },
};