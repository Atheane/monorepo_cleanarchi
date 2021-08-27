module.exports = {
  displayName: 'pfm-azf',
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
  coverageDirectory: '../../../coverage/apps/pfm-azf',
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
  coveragePathIgnorePatterns: ['node_modules'],
};
