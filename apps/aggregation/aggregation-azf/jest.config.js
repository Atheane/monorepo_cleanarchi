module.exports = {
  displayName: 'aggregation-azf',
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
  coverageDirectory: '../../../coverage/apps/aggregation-azf',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  verbose: true,
  coverageReporters: ['text-summary', 'html'],
  coveragePathIgnorePatterns: ['node_modules', 'account-sync/src/config/'],
  setupFilesAfterEnv: [
    '../../../mongodb.teardown.ts'
  ]
};
