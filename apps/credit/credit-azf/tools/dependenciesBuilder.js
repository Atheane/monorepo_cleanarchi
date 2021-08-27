/* eslint-disable */
/**
 *
 *
 * Please touch to this file only if you know what you are doing :-)
 *
 *
 * */
const depcheck = require('depcheck');
const fs = require('fs');

const options = {
  ignoreBinPackage: false, // ignore the packages with bin entry
  skipMissing: false, // skip calculation of missing dependencies
  ignorePatterns: [
    // files matching these patterns will be ignored
    'sandbox',
    'dist',
    'bower_components',
  ],
  ignoreMatches: [
    // ignore dependencies that matches these globs
    'grunt-*',
  ],
  parsers: {
    // the target parsers
    '**/*.ts': depcheck.parser.typescript,
  },
  detectors: [
    // the target detectors
    depcheck.detector.requireCallExpression,
    depcheck.detector.importDeclaration,
  ],
  specials: [
    // the target special parsers
    depcheck.special.eslint,
    depcheck.special.webpack,
  ],
  package: {
    // may specify dependencies instead of parsing package.json
    dependencies: {
      lodash: '^4.17.15',
    },
    devDependencies: {
      eslint: '^6.6.0',
    },
    peerDependencies: {},
    optionalDependencies: {},
  },
};

const dependenciesBuilder = (dependencies, type) => {
  let obj = {};
  const source = type === 'dependencies' ? Object.keys(dependencies) : dependencies;
  source.map(dependency => {
    // Check that oney dependency is listed in workspace.json
    const rawdata = fs.readFileSync('../../../package.json');
    const globalDependencies = JSON.parse(rawdata)[type];
    //console.log(globalDependencies)
    if (Object.keys(globalDependencies).includes(dependency)) {
      obj[dependency] = globalDependencies[dependency];
    } else {
      const rawdata = fs.readFileSync('../../../workspace.json');
      const nxDependencies = JSON.parse(rawdata).projects;
      const nxLib = dependency.split('/')[1];
      if (!nxDependencies[nxLib]) {
        console.warn(
          '-------------------- dependencies ' +
            dependency +
            ' not found in ' +
            type +
            '---------------------------'
        );
        return;
      }
      if (nxDependencies[nxLib].projectType === 'library') {
        const pathToFindLib = nxDependencies[nxLib].architect.build.options.outputPath;
        obj[dependency] = pathToFindLib.replace('dist', '.');
      } else {
        // Case where dependency is missing either in global package.json and nx workspace
        throw new Error('Missing dependency ' + dependency);
      }
    }
  });
  return obj;
};

depcheck('./', options).then(unused => {
  /**
   * {
   *   "key": string[]
   * }
   * */
  const dependencies = unused.missing;
  //console.log(dependencies)

  /**
   * string[]
   * */
  const devDependencies = unused.devDependencies;

  let azfPackageJson = fs.readFileSync('package.json');
  azfPackageJson = JSON.parse(azfPackageJson);

  const buildedDependencies = dependenciesBuilder(dependencies, 'dependencies');
  const buildedDevDependencies = dependenciesBuilder(devDependencies, 'devDependencies');

  azfPackageJson['dependencies'] = {
    ...buildedDependencies,
    tslib: '1.10.0',
  };
  azfPackageJson['devDependencies'] = buildedDevDependencies;
  return fs.writeFileSync('package.json', JSON.stringify(azfPackageJson, null, 4));
});
