module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  restoreMocks: true,
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
