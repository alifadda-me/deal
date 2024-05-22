import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  clearMocks: true,
  resetMocks: true,
  testEnvironment: 'node',
  testTimeout: 60000,
  preset: 'ts-jest/presets/js-with-ts',
  testMatch: ['**/?(*.)+(spec|test).(ts|js)'],
  testPathIgnorePatterns: ['dist'],
  reporters: ['default', 'jest-junit'],
  coverageReporters: ['lcov'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**'],
  cacheDirectory: '.jest_cache',
  setupFiles: ['<rootDir>/dotenv-test-config.ts'],
  setupFilesAfterEnv: ['<rootDir>/global-mocks.ts'],
  globalTeardown: '<rootDir>/e2e_tests/setup/docker.setup.teardown.ts',
  globalSetup: '<rootDir>/e2e_tests/setup/docker.setup.ts',
};
export default config;
