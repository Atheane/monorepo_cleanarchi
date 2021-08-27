import { addPackageWithInit, formatFiles } from '@nrwl/workspace';
import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { UserOptions } from '../schema';
import generateFiles from '../utilities/generateFiles';
import ProjectTools from '../utilities/projectTools';
import updateNxJson from '../utilities/updateNxJson';

// noinspection JSUnusedGlobalSymbols
export default function (UserOptions: UserOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const tools = new ProjectTools(UserOptions, context);
    const options = tools.options;
    tools.log('Start template creation');

    return chain([
      addPackageWithInit('@nrwl/jest') as any,
      formatFiles(options),
      generateFiles(options),
      updateNxJson(options),
      tools.updateWorkspaceJson(options),
    ])(tree, context);
  };
}
