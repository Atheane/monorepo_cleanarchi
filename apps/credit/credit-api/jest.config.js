module.exports = {
  displayName: 'credit-api',
  preset: '../../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/apps/credit/credit-api',
  coverageThreshold: {
    global: {
      branches: 84.51,
      functions: 86.13,
      lines: 93.18,
      statements: 93.22,
    },
  },
  verbose: true,
  coverageReporters: ['text-summary', 'html'],
  coveragePathIgnorePatterns: ['node_modules'],
  testEnvironment: 'node',
  setupFilesAfterEnv: [
    '../../../mongodb.teardown.ts'
  ]
};
