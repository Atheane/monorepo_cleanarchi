module.exports = {
  displayName: 'common-envs',
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
  coverageDirectory: '../../../coverage/libs/envs',
  coverageThreshold: {
    global: {
      branches: 88.37,
      functions: 100,
      lines: 96.55,
      statements: 96.67
    }
  },
  verbose: true,
  coverageReporters: ['text-summary', 'html'],
  coveragePathIgnorePatterns: [
    "node_modules",
  ],
};
