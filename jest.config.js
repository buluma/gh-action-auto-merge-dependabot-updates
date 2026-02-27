module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  restoreMocks: true,
  moduleNameMapper: {
    '^@octokit/plugin-throttling$':
      '<rootDir>/__mocks__/@octokit/plugin-throttling.ts',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@octokit|bottleneck)/)'
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
