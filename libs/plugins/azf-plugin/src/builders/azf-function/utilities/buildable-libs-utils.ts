/* eslint-disable */
import { ProjectGraph, ProjectGraphNode, ProjectType } from '@nrwl/workspace/src/core/project-graph';

import { BuilderContext } from '@angular-devkit/architect';
import { join, resolve, dirname } from 'path';
import { fileExists, readJsonFile, writeJsonFile } from '@nrwl/workspace/src/utils/fileutils';
import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import { getOutputsForTargetAndConfiguration } from '@nrwl/workspace/src/tasks-runner/utils';
import * as ts from 'typescript';
import { unlinkSync } from 'fs';

function isBuildable(target: string, node: ProjectGraphNode): boolean {
  return node.data.architect && node.data.architect[target] && node.data.architect[target].builder !== '';
}

export type DependentBuildableProjectNode = {
  name: string;
  outputs: string[];
  node: ProjectGraphNode;
};

export function calculateProjectDependencies(
  projGraph: ProjectGraph,
  context: BuilderContext,
): { target: ProjectGraphNode; dependencies: DependentBuildableProjectNode[] } {
  const target = projGraph.nodes[context.target.project];
  // gather the library dependencies
  const dependencies = recursivelyCollectDependencies(context.target.project, projGraph, [])
    .map(dep => {
      const depNode = projGraph.nodes[dep];
      context.logger.log('info', ProjectType.lib);
      if (depNode.type === ProjectType.lib && isBuildable(context.target.target, depNode)) {
        const libPackageJson = readJsonFile(join(context.workspaceRoot, depNode.data.root, 'package.json'));

        return {
          name: libPackageJson.name, // i.e. @workspace/mylib
          outputs: getOutputsForTargetAndConfiguration(
            context.target.target as any,
            context.target.configuration as any,
          ),
          node: depNode,
        };
      } else {
        return null;
      }
    })
    .filter(x => !!x);
  return { target, dependencies };
}

function recursivelyCollectDependencies(project: string, projGraph: ProjectGraph, acc: string[]) {
  (projGraph.dependencies[project] || []).forEach(dependency => {
    if (acc.indexOf(dependency.target) === -1) {
      acc.push(dependency.target);
      recursivelyCollectDependencies(dependency.target, projGraph, acc);
    }
  });
  return acc;
}

export function readTsConfigWithRemappedPaths(
  tsConfig: string,
  dependencies: DependentBuildableProjectNode[],
) {
  const parsedTSConfig = ts.readConfigFile(tsConfig, ts.sys.readFile).config;
  parsedTSConfig.compilerOptions = parsedTSConfig.compilerOptions || {};
  parsedTSConfig.compilerOptions.paths = readPaths(tsConfig) || {};
  updatePaths(dependencies, parsedTSConfig.compilerOptions.paths);
  return parsedTSConfig;
}

function readPaths(tsConfig: string) {
  try {
    const parsedTSConfig = ts.readConfigFile(tsConfig, ts.sys.readFile).config;
    if (parsedTSConfig.compilerOptions && parsedTSConfig.compilerOptions.paths) {
      return parsedTSConfig.compilerOptions.paths;
    } else if (parsedTSConfig.extends) {
      return readPaths(resolve(dirname(tsConfig), parsedTSConfig.extends));
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
}

export function createTmpTsConfig(
  tsconfigPath: string,
  workspaceRoot: string,
  projectRoot: string,
  dependencies: DependentBuildableProjectNode[],
) {
  const parsedTSConfig = readTsConfigWithRemappedPaths(tsconfigPath, dependencies);
  const tmpTsConfigPath = join(workspaceRoot, projectRoot, 'tsconfig.nx-tmp');
  process.on('exit', () => {
    cleanupTmpTsConfigFile(tmpTsConfigPath);
  });
  process.on('SIGTERM', () => {
    cleanupTmpTsConfigFile(tmpTsConfigPath);
    process.exit(0);
  });
  process.on('SIGINT', () => {
    cleanupTmpTsConfigFile(tmpTsConfigPath);
    process.exit(0);
  });
  writeJsonFile(tmpTsConfigPath, parsedTSConfig);
  return join(projectRoot, 'tsconfig.nx-tmp');
}

function cleanupTmpTsConfigFile(tmpTsConfigPath) {
  try {
    if (tmpTsConfigPath) {
      unlinkSync(tmpTsConfigPath);
    }
  } catch (e) {}
}

export function checkDependentProjectsHaveBeenBuilt(
  context: BuilderContext,
  projectDependencies: DependentBuildableProjectNode[],
): boolean {
  const depLibsToBuildFirst: DependentBuildableProjectNode[] = [];

  // verify whether all dependent libraries have been built
  projectDependencies.forEach(dep => {
    const paths = dep.outputs.map(p => join(context.workspaceRoot, p, 'package.json'));

    if (!paths.some(fileExists)) {
      depLibsToBuildFirst.push(dep);
    }
  });

  if (depLibsToBuildFirst.length > 0) {
    context.logger.error(stripIndents`
      Some of the project ${
        context.target.project
      }'s dependencies have not been built yet. Please build these libraries before:
      ${depLibsToBuildFirst.map(x => ` - ${x.node.name}`).join('\n')}

      Try: nx run ${context.target.project}:${context.target.target} --with-deps
    `);

    return false;
  } else {
    return true;
  }
}

export function updatePaths(dependencies: DependentBuildableProjectNode[], paths: { [k: string]: string[] }) {
  dependencies.forEach(dep => {
    if (dep.outputs && dep.outputs.length > 0) {
      paths[dep.name] = dep.outputs;
    }
  });
}

/**
 * Updates the peerDependencies section in the `dist/lib/xyz/package.json` with
 * the proper dependency and version
 */
export function updateBuildableProjectPackageJsonDependencies(
  context: BuilderContext,
  node: ProjectGraphNode,
  dependencies: DependentBuildableProjectNode[],
) {
  const outputs = getOutputsForTargetAndConfiguration(
    context.target.target as any,
    context.target.configuration as any,
  );

  const packageJsonPath = `${outputs[0]}/package.json`;
  let packageJson;
  try {
    packageJson = readJsonFile(packageJsonPath);
  } catch (e) {
    // cannot find or invalid package.json
    return;
  }

  packageJson.dependencies = packageJson.dependencies || {};

  let updatePackageJson = false;
  dependencies.forEach(entry => {
    if (
      !hasDependency(packageJson, 'dependencies', entry.name) &&
      !hasDependency(packageJson, 'devDependencies', entry.name) &&
      !hasDependency(packageJson, 'peerDependencies', entry.name)
    ) {
      try {
        const outputs = getOutputsForTargetAndConfiguration(
          context.target.target as any,
          context.target.configuration as any,
        );
        const depPackageJsonPath = join(context.workspaceRoot, outputs[0], 'package.json');
        const depPackageJson = readJsonFile(depPackageJsonPath);

        packageJson.dependencies[entry.name] = depPackageJson.version;
        updatePackageJson = true;
      } catch (e) {
        // skip if cannot find package.json
      }
    }
  });

  if (updatePackageJson) {
    writeJsonFile(packageJsonPath, packageJson);
  }
}

// verify whether the package.json already specifies the dep
function hasDependency(outputJson, depConfigName: string, packageName: string) {
  if (outputJson[depConfigName]) {
    return outputJson[depConfigName][packageName];
  } else {
    return false;
  }
}
