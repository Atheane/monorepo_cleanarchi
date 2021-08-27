// @ts-nocheck
import 'reflect-metadata';
var util = require('util');
jest.setTimeout(30000);
util.inspect.defaultOptions.depth = null; //enable full object reporting in console.log

jasmine.getEnv().addReporter({
  specStarted: result => {
    jasmine.currentTest = result;
  },
  specDone: result => (jasmine.currentTest = result),
});

const getFixtureName = () => {
  let testName = jasmine.currentTest.fullName;
  testName = testName.replace(/\s/g, '_');
  testName = testName + '.json';
  /*
   * We may use windows test and build agent
   * The Windows API imposes a maximum filename length such that a filename, including the file path to get to the file, can't exceed 255-260 characters.
   * So let's take a conservative limit, I liked the original Tweet length so let's use that
   */
  const fileNameLengthLimit = 140;
  if (testName.length >= fileNameLengthLimit) {
    throw new Error(`fixture name too long: ${testName}`);
  }
  return testName;
};

test.getFixtureName = getFixtureName;
