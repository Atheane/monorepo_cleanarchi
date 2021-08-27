require('reflect-metadata');
var util = require('util');

util.inspect.defaultOptions.depth = null; //enable full object reporting in console.log

jest.setTimeout(15000);

jasmine.getEnv().addReporter({
  specStarted: result => {
    // console.log(
    //   `Spec name: ${result.fullName}, description: ${result.description}`
    // );
    // console.log(`Spec name: ${result.fullName}`);
    jasmine.currentTest = result;
  },
  specDone: result => (jasmine.currentTest = result),
});
