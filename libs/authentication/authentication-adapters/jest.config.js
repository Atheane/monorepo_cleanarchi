module.exports = {
  displayName: 'authentication-adapters',
  preset: '../../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/authentication/authentication-adapters',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      statements: 92.36,
      branches: 84.59,
      functions: 84.92,
      lines: 91.96
    },
  },
  verbose: true,
  coverageReporters: ['text-summary', 'html'],
  coveragePathIgnorePatterns: ['node_modules'],
};
