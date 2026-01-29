module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/tests/**',
    '!jest.config.js',
    '!server.js'
  ],
  testTimeout: 30000, // 30 seconds timeout for all tests
  maxWorkers: 1 // Run tests sequentially to avoid database conflicts
};
