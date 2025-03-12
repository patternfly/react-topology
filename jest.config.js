module.exports = {
  clearMocks: true,
  testMatch: ['**/__tests__/**/*.{js,ts}?(x)', '**/*.test.{js,ts}?(x)'],
  modulePathIgnorePatterns: ['<rootDir>/packages/*.*/dist/*.*', '<rootDir>/packages/*.*/public/*.*'],
  roots: ['<rootDir>/packages'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
    '^.+\\.svg$': 'jest-transform-stub'
  },
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/styleMock.js'
  },
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['node_modules/(?!@patternfly)'],
  testPathIgnorePatterns: ['<rootDir>/packages/demo-app-ts/'],
  setupFilesAfterEnv: ['<rootDir>/testSetup.ts']
};
