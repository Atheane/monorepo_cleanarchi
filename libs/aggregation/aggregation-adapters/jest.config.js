module.exports = {
  displayName: {
    name: 'aggregation-adapters',
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
  roots: ['<rootDir>/src/lib/__tests__'],
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  verbose: true,
  moduleFileExtensions: ['ts', 'js', 'html'],
  coveragePathIgnorePatterns: ['node_modules', 'src/lib/__tests__', 'index.ts'],
  coverageDirectory: '../../../coverage/libs/aggregation/aggregation-adapters',
  coverageReporters: ['text-summary', 'html'],
  coverageThreshold: {
    global: {
      statements: 99.77,
      branches: 99.45,
      functions: 100,
      lines: 99.75,
    },
  },
  collectCoverage: true,
};
