module.exports = {
  displayName: {
    name: 'pfm-adapters',
    color: 'blueBright',
  },
  setupFilesAfterEnv: ['./jest.setup.js', '../../../jest.setup.ts', '../../../mongodb.teardown.ts'],
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  roots: ['<rootDir>/src/lib/_tests_'],
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  verbose: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coveragePathIgnorePatterns: ['node_modules', 'src/lib/__tests__'],
  coverageDirectory: '../../../coverage/libs/pfm/pfm-adapters',
  coverageReporters: ['text-summary', 'html'],
  coverageThreshold: {
    global: {
      statements: 95.88,
      branches: 91.98,
      functions: 88.19,
      lines: 95.87,
    },
  },
  collectCoverage: true,
};
