module.exports = {
  displayName: {
    name: 'payment-adapters',
    color: 'blueBright',
  },
  preset: '../../../jest.preset.js',
  setupFilesAfterEnv: ['../../../jest.setup.ts'],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/payment/payment-adapters',
  coverageThreshold: {
    global: {
      branches: 93.69,
      functions: 98.28,
      lines: 99.37,
      statements: 99.31,
    },
  },
  verbose: true,
  coverageReporters: ['text-summary', 'html'],
  coveragePathIgnorePatterns: ['node_modules'],
};
