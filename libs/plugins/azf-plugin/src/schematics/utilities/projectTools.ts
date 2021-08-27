/* eslint-disable */
import { Options, UserOptions } from '../schema';
import { join, normalize } from '@angular-devkit/core';
import { inspect } from 'util';
import { Rule } from '@angular-devkit/schematics';
import {
  generateProjectLint,
  Linter,
  offsetFromRoot,
  projectRootDir,
  ProjectType,
  toClassName,
  toFileName,
  toPropertyName,
  updateWorkspaceInTree,
} from '@nrwl/workspace';

export default class ProjectTools {
  userOptions: UserOptions;
  options: Options;
  project: any;
  context: any;

  constructor(userOptions, context) {
    this.context = context;
    this.userOptions = userOptions;
    this.options = this.normalizeOptions(userOptions);
    this.project = {
      root: this.options.appProjectRoot,
      sourceRoot: join(this.options.appProjectRoot, 'src'),
      projectType: 'application',
      prefix: this.options.name,
      schematics: {},
      architect: <any>{},
    };
    return this;
  }

  normalizeOptions(userOptions: UserOptions): Options {
    const linter = userOptions.linter || Linter.EsLint;
    const projectType = ProjectType.Application;
    const name = toFileName(userOptions.name);
    const projectDirectory = userOptions.directory
      ? `${toFileName(userOptions.directory)}/${toFileName(userOptions.prefix)}/${name}`
      : `${toFileName(userOptions.prefix)}/${name}`;
    const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
    const projectRoot = `${projectRootDir(projectType)}/${projectDirectory}`;
    const parsedTags = userOptions.tags ? userOptions.tags.split(',').map(s => s.trim()) : [];
    const className = toClassName(userOptions.name);
    const propertyName = toPropertyName(userOptions.name);

    const appDirectory = userOptions.directory
      ? `${toFileName(userOptions.directory)}/${toFileName(userOptions.prefix)}/${toFileName(
          userOptions.name,
        )}`
      : `${toFileName(userOptions.prefix)}/${toFileName(userOptions.name)}`;

    const appProjectRoot = join(normalize('apps'), appDirectory);
    const dot = '.';

    return {
      ...userOptions,
      linter,
      projectName,
      appDirectory,
      appProjectRoot,
      projectRoot,
      projectDirectory,
      parsedTags,
      className,
      propertyName,
      projectType,
      dot,
      offsetFromRoot: offsetFromRoot(projectRoot),
    };
  }

  createCommand(commands: { command: string }[]) {
    return {
      builder: '@nrwl/workspace:run-commands',
      options: {
        commands: commands,
      },
    };
  }

  getServeConfig(options = this.options) {
    const commands = [{ command: 'node tools/postbuild.js && npm install && npx func start' }];
    return this.createCommand(commands);
  }

  getPostBuildConfig(options = this.options) {
    return {
      builder: '@nrwl/workspace:run-commands',
      options: {
        commands: [
          {
            command: 'node tools/postbuild.js',
          },
        ],
        cwd: 'dist/' + options.appProjectRoot,
      },
    };
  }

  getTestConfig(options = this.options) {
    return {
      builder: '@nrwl/jest:jest',
      options: {
        jestConfig: join(options.appProjectRoot, 'jest.config.js'),
        tsConfig: join(options.appProjectRoot, 'tsconfig.spec.json'),
        passWithNoTests: true,
      },
    };
  }

  getBuildConfig(project = this.project, options = this.options) {
    return {
      builder: '@nrwl/workspace:run-commands',
      options: {
        commands: [
          {
            command: 'node ./tools/dependenciesBuilder.js && yarn build',
          },
        ],
        cwd: options.appProjectRoot,
      },
    };
  }

  getLintConfig(project = this.project) {
    return generateProjectLint(
      normalize(project.root),
      join(normalize(project.root), 'tsconfig.app.json'),
      Linter.EsLint,
      [`${project.root}/**/*.ts`],
    );
  }

  getProjectArchitect() {
    this.project.architect.serve = this.getServeConfig();
    this.project.architect.serve.options['cwd'] = 'dist/' + this.project.root;
    this.project.architect.lint = this.getLintConfig();
    this.project.architect.test = this.getTestConfig();
    this.project.architect.build = this.getBuildConfig();
    this.project.architect['post-build'] = this.getPostBuildConfig();
    //this.project.architect.deploy = this.getDeployConfig();
    return this.project;
  }

  updateWorkspaceJson(options): Rule {
    return updateWorkspaceInTree(workspaceJson => {
      workspaceJson.projects[`${options.prefix}/${options.name}`] = this.getProjectArchitect();
      //workspaceJson.defaultProject = workspaceJson.defaultProject || options.name;
      return workspaceJson;
    }) as any;
  }

  log(message) {
    this.context.logger.info(inspect(message, false, null));
  }
}
