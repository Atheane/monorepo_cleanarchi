const nxPreset = require('@nrwl/jest/preset');
const jestMongo = require('@shelf/jest-mongodb/jest-preset');


module.exports = {
  ...nxPreset,
  ...jestMongo,
  setupFiles: ["jest-date-mock"],
  watchPathIgnorePatterns: ['globalConfig']
};
