import { defaultLogger } from '@oney/logger-adapters';
import * as handlebars from 'handlebars';
import * as helpers from 'handlebars-helpers';
import { injectable } from 'inversify';
import * as fs from 'fs';
import { WriterI } from '../../domain/services/WriterI';
import { CompiledHTMLType } from '../../domain/types/CompiledHTMLType';
import { CompiledSettingsType } from '../../domain/types/CompiledSettingsType';
import { PayloadType } from '../../domain/types/PayloadType';

const compiler = handlebars.create();
helpers({ handlebars: compiler });

@injectable()
export class Writer implements WriterI {
  async generate(payload: PayloadType, compiledSettings: CompiledSettingsType): Promise<CompiledHTMLType> {
    try {
      const contentTemplate = await fs.promises.readFile(compiledSettings.contentBodyPath, 'utf-8');
      let footer;
      if (compiledSettings.contentFooterPath) {
        const footerTemplate = await fs.promises.readFile(compiledSettings.contentFooterPath, 'utf-8');
        footer = compiler.compile(footerTemplate)(payload);
      }
      return {
        content: compiler.compile(contentTemplate)(payload),
        footer: footer,
      };
    } catch (error) {
      defaultLogger.error('@oney/notification.Writer.generate.catch', error);
      throw error;
    }
  }
}
