module.exports = {
  displayName: 'pfm-api',
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
  coverageDirectory: '../../../coverage/apps/pfm/pfm-api',
  coverageThreshold: {
    global: {
      branches: 3.85,
      functions: 9.35,
      lines: 48.24,
      statements: 51.9,
    },
  },
  verbose: true,
  coverageReporters: ['text-summary', 'html'],
  coveragePathIgnorePatterns: ['node_modules'],
  testEnvironment: 'node',
};
