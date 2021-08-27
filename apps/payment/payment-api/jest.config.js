module.exports = {
  displayName: {
    name: 'payment-api',
    color: 'blueBright',
  },
  preset: '../../../jest.preset.js',
  setupFilesAfterEnv: ['../../../jest.setup.ts', '../../../mongodb.teardown.ts'],
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/apps/payment/payment-api',
  coverageThreshold: {
    global: {
      branches: 61.19,
      functions: 98.57,
      lines: 93.26,
      statements: 93.75,
    },
  },
  verbose: true,
  coverageReporters: ['text-summary', 'html'],
  coveragePathIgnorePatterns: ['node_modules'],
};
