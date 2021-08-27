module.exports = {
  displayName: 'authentication-api',
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
  coverageDirectory: '../../../coverage/apps/authentication/api',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      statements: 99.83,
      branches: 97.1,
      functions: 100,
      lines: 99.82,
    },
  },
  verbose: true,
  coverageReporters: ['text-summary', 'html'],
  coveragePathIgnorePatterns: ['node_modules'],
  setupFilesAfterEnv: [
    '../../../mongodb.teardown.ts'
  ]
};
