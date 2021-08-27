module.exports = {
  displayName: {
    name: 'aggregation-api',
    color: 'blueBright',
  },
  setupFilesAfterEnv: ['../../../jest.setup.ts'],
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  verbose: true,
  moduleFileExtensions: ['ts', 'js', 'html'],
  coveragePathIgnorePatterns: ['node_modules', 'src/config', 'src/__test__'],
  modulePathIgnorePatterns: ['src/config'],
  coverageDirectory: '../../../coverage/apps/aggregation/aggregation-api',
  coverageReporters: ['text-summary', 'html'],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
  collectCoverage: true,
};
