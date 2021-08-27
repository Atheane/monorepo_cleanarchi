module.exports = {
  displayName: 'applicationinsights-enhanced',
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
  coverageDirectory: '../../coverage/libs/applicationinsights-enhanced',
  collectCoverage: true,
  silent: true,
  coverageThreshold: {
    global: {
      statements: 97.13,
      branches: 71.43,
      functions: 98.18,
      lines: 97.09,
    },
  },
};
