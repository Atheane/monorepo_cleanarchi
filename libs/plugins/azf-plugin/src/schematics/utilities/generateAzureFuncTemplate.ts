/* eslint-disable */
import { names, offsetFromRoot } from '@nrwl/workspace';
import { Options } from '../schema';
import {
  apply,
  applyTemplates,
  chain,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  Tree,
  url,
} from '@angular-devkit/schematics';

// Work In Progress.

export default function generateAzureFuncTemplate(options: Options): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const templateSource = apply(url(`./files/${options.template}`), [
      applyTemplates({
        ...options,
        ...names(options.name),
        offsetFromRoot: offsetFromRoot(options.projectRoot),
      }),
      move(`${options.projectRoot}/${options.name}`),
    ]);
    return chain([mergeWith(templateSource, MergeStrategy.Overwrite)])(tree, context);
  };
}
