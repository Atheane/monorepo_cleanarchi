/* eslint-disable */
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

const rootPath = path.resolve(__dirname + '/../');
const normalizePath = path.normalize(rootPath).replace(/\\/g, '/');


function copyFileSync(source, target) {
  var targetFile = target;
  // If target is a directory, a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }
  fs.writeFileSync(targetFile, fs.readFileSync(source));
}
function copyFolderRecursiveSync(source, target) {
  var files = [];
  // Check if folder needs to be created or integrated
  var targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }
  // Copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach(function (file) {
      var curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      }
      else {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
}

copyFolderRecursiveSync(normalizePath + '/../../../libs', normalizePath);

async function normalizeLibsDirectory(path) {
  const folderLists = [];
  const dir = await fs.promises.opendir(path)
  for await (const dirent of dir) {
    const directory = await fs.readdirSync(normalizePath + '/libs/' + dirent.name)
    if(directory.includes('package.json')) {
      folderLists.push(dirent.name)
    } else {
      rimraf.sync(normalizePath + '/libs/' + dirent.name)
    }
  }
  return folderLists;
}

async function listPackageJsonFromlibs() {

  const libsList = await normalizeLibsDirectory(normalizePath + '/libs');
  const rawdata = fs.readFileSync(normalizePath + '/../../../../package.json');
  const globalDependencies = JSON.parse(rawdata)['dependencies'];

  for await (const directory of libsList) {
    let obj = {};
    const openPackageJson = await fs.readFileSync(normalizePath + '/libs/' + directory + '/package.json', {encoding: 'utf-8'})
    const parsedPackageJson = JSON.parse(openPackageJson)
    const libDependencies = parsedPackageJson['dependencies'];
    //console.log(globalDependencies)
    if (libDependencies) {
      Object.keys(libDependencies).map(dependency => {
        if (Object.keys(globalDependencies).includes(dependency)) {
          obj[dependency] = globalDependencies[dependency];
        } else {
          obj[dependency] = '../' + dependency.split('/')[1]
        }

      })
      parsedPackageJson['dependencies'] = obj;
      parsedPackageJson['main'] = parsedPackageJson['main'].replace(/\\/g, '/')
      parsedPackageJson['typings'] = parsedPackageJson['typings'].replace(/\\/g, '/')
      await fs.writeFileSync(normalizePath + '/libs/' + directory + '/package.json', JSON.stringify(parsedPackageJson, null, 4))
    }
  }

}

console.log('Copying npmrc to project')
copyFileSync(normalizePath + '/../../../../.npmrc', normalizePath)

console.log('Building libs with local dependencies .... Please wait a little :-)')
listPackageJsonFromlibs()
