import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { UserOptions } from '../schema';
import generateAzureFuncTemplate from '../utilities/generateAzureFuncTemplate';
import ProjectTools from '../utilities/projectTools';

// Work In Progress ... To be Continued in v2.0

// noinspection JSUnusedGlobalSymbols
export default function (UserOptions: UserOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const tools = new ProjectTools(UserOptions, context);
    const options = tools.options;
    tools.log('Start function template creation');

    return chain([generateAzureFuncTemplate(options)])(tree, context);
  };
}
