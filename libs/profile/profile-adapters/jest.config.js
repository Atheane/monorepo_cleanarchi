module.exports = {
  displayName: 'profile-adapters',
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
  coverageDirectory: '../../../coverage/libs/profile/profile-adapters',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      statements: 99.57,
      branches: 95.09,
      functions: 94.63,
      lines: 99.52,
    }
  },
  verbose: true,
  coverageReporters: ['text-summary', 'html'],
  coveragePathIgnorePatterns: [
    "node_modules",
  ],
  testPathIgnorePatterns: [
    './src/index.ts',
    './src/lib/__test__/fixtures'
  ],
  setupFilesAfterEnv: ['../../../jest.setup.ts', '../../../mongodb.teardown.ts']
};
