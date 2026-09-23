export default {
  globalSetup: '<rootDir>/src/test/globalSetup.js',
  globalTeardown: '<rootDir>/src/test/globalTeardown.js',
  setupFilesAfterEnv: ['<rootDir>/src/test/setupFileAfterEnv.js'],
  testEnvironment: 'node',
}
