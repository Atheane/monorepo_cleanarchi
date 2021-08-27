# Introduction

TODO: Give a short introduction of your project. Let this section explain the objectives or the motivation behind this project.

# Getting Started

This project uses yarn, please use this package manager.

### Setup NPM

- [To setup your npm registry](https://oneytemp.atlassian.net/wiki/spaces/ON/pages/149520405/Oney+npm+registry)

### Prerequisites

- [Install azure-functions-core-tools](https://github.com/Azure/azure-functions-core-tools/#installing)

- after execute cmd `npm i -g azure-functions-core-tools@3 --unsafe-perm true`

##### To generate a lib :

````
npx nx g @nrwl/node:library <folder_name> --publishable --importPath="@oney/<lib_name>" --tags="scope:public,type:util,target:all"
````

##### To generate an azf :

````
 nx generate @oney/azf-plugin:func projectname
 nx build projectname
 nx test projectname
 nx serve projectname
````

##### To generate an azf func :

````
cd apps/projectname
npx func new
````

##### To remove an app / lib :

````
npx nx g @nrwl/workspace:rm <project name>
````

# Build and Test

TODO: Describe and show how to build your code and run the tests.

# Contribute

TODO: Explain how other users and developers can contribute to make your code better. 
