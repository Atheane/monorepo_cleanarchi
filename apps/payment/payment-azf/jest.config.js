module.exports = {
  displayName: 'payment-azf',
  preset: '../../../jest.preset.js',
  setupFilesAfterEnv: ['../../../jest.setup.ts', '../../../mongodb.teardown.ts'],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/apps/payment-azf',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 92.86,
      functions: 100,
      lines: 99.46,
      statements: 99.5,
    },
  },
  verbose: true,
  coverageReporters: ['text-summary', 'html'],
  coveragePathIgnorePatterns: ['node_modules'],
};
