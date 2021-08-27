module.exports = {
  displayName: "subscriptionAzf",
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
  coverageDirectory: '../../../coverage/apps/subscription/subscriptionAzf',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  verbose: true,
  coverageReporters: ['text-summary', 'html'],
  coveragePathIgnorePatterns: [
    "node_modules",
  ],
};
