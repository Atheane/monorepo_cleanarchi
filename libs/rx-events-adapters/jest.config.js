module.exports = {
  displayName: 'rx-events-adapters',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/rx-events-adapters',
  coverageThreshold: {
    global: {
      branches: 58.33,
      functions: 86.36,
      lines: 89.25,
      statements: 90.83
    }
  },
  verbose: true,
  coverageReporters: ['text-summary', 'html'],
  coveragePathIgnorePatterns: [
    "node_modules"
  ],

};
