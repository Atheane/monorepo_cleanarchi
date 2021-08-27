import * as handlebars from 'handlebars';
import * as helpers from 'handlebars-helpers';
import * as fs from 'fs';
import { CompiledHTMLType } from '../type/CompiledHTML';
import { CompiledSettings } from '../type/CompiledSettings';
import { IProcess } from '../type/IProcess';
import { Error } from '../type/Error';

const compiler = handlebars.create();
helpers({ handlebars: compiler });

export class Process implements IProcess {
  /* istanbul ignore next */
  constructor(private isInTestMode = false) {}

  async compiled(payload: any, compiledSettings: CompiledSettings): Promise<CompiledHTMLType> {
    try {
      /* istanbul ignore next */
      const prefix = this.isInTestMode ? '/../' : '/../../libs/document-generator/src/lib/';
      const contentTemplate = await fs.promises.readFile(
        `${__dirname}${prefix}${compiledSettings.body}`,
        'utf-8',
      );
      let footer;
      if (compiledSettings.footer) {
        const footerTemplate = await fs.promises.readFile(
          `${__dirname}${prefix}${compiledSettings.footer}`,
          'utf-8',
        );
        footer = compiler.compile(footerTemplate)(payload);
      }
      return {
        content: compiler.compile(contentTemplate)(payload),
        footer: footer,
      };
    } catch (error) {
      /* istanbul ignore next */
      console.log('compiled failed=>', error);
      /* istanbul ignore next */
      throw new Error.CompilationFailed(error);
    }
  }
}
