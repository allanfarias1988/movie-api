
/** @type {import('jest').Config} */
const config = {
  bail: true,
  coverageProvider: "v8",
  testMatch: ["<rootDir>/src/**/*.spec.js"],
};

export default config;
