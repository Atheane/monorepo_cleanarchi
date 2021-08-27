module.exports = {
  displayName: {
    name: 'credit-azf',
    color: 'blueBright',
  },
  setupFilesAfterEnv: ['./jest.setup.js', '../../../mongodb.teardown.ts'],
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
  coverageDirectory: '../../../coverage/apps/credit-azf',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 95,
      functions: 100,
      lines: 100,
    },
  },
  verbose: true,
  coverageReporters: ['text-summary', 'html'],
  coveragePathIgnorePatterns: ['node_modules']
};
