module.exports = {
  displayName: {
    name: 'authentication-azf',
    color: 'blueBright',
  },
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
  coverageDirectory: '../../../coverage/apps/authentication-azf/src',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 94.12,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  verbose: true,
  coverageReporters: ['text-summary', 'html'],
  coveragePathIgnorePatterns: ['node_modules'],
  setupFilesAfterEnv: [
    '../../../mongodb.teardown.ts'
  ]
};
