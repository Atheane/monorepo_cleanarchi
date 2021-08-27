require('reflect-metadata');
const util = require('util');

util.inspect.defaultOptions.depth = null; //enable full object reporting in console.log

jest.setTimeout(30000);

jasmine.getEnv().addReporter({
  specStarted: result => {
    jasmine.currentTest = result;
  },
  specDone: result => (jasmine.currentTest = result),
});
