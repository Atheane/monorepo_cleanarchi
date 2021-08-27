module.exports = {
  displayName: 'subscription-adapters',
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
  coverageDirectory: '../../../coverage/libs/subscription/subscription-adapters',
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
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
  setupFilesAfterEnv: ['../../../jest.setup.ts']
};
