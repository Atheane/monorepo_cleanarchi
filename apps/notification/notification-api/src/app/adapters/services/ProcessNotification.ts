import { defaultLogger } from '@oney/logger-adapters';
import { inject, injectable } from 'inversify';
import * as _ from 'lodash';
import * as path from 'path';
import { config } from '../../config/config.env';
import { Identifiers } from '../../di/Identifiers';
import { ProcessNotificationI } from '../../domain/services/ProcessNotificationI';
import { SendNotificationI } from '../../domain/services/SendNotificationI';
import { WriterI } from '../../domain/services/WriterI';
import { CompiledHTMLType } from '../../domain/types/CompiledHTMLType';
import { DataSendType } from '../../domain/types/DataSendType';
import { SettingsType } from '../../domain/types/SettingsType';

@injectable()
export class ProcessNotification implements ProcessNotificationI {
  constructor(
    @inject(Identifiers.SendNotificationI)
    private readonly sendNotificationI: SendNotificationI,
    @inject(Identifiers.WriterI) private readonly writer: WriterI,
  ) {}

  async processNotification(receive: any, settings: SettingsType): Promise<DataSendType> {
    const { corporateBankInfo, accountApiUrl, authenticationApiUrl, appInfo } = config;
    const { name, city, street, zip_code, country, customer_service, capital } = corporateBankInfo;
    try {
      const payload = {
        corporate: {
          name,
          customer_service: customer_service,
          capital: capital,
          address: {
            city,
            street,
            zip_code,
            country,
          },
        },
        base_url: {
          odb_account: accountApiUrl,
          odb_account_management: accountApiUrl,
          odb_authentication: authenticationApiUrl,
        },
        message: { ...receive },
      };

      const prefix =
        appInfo.env === 'production' || appInfo.env === 'test'
          ? '../../Templates/'
          : '../notification-api/src/app/Templates/';
      const compiledSettings = {
        contentBodyPath: path.join(__dirname, prefix, settings.contentBodyPath),
        contentFooterPath: settings.contentFooterPath
          ? path.join(__dirname, prefix, settings.contentFooterPath)
          : undefined,
      };

      defaultLogger.info(`generate compiledTemplates`);
      const compiledTemplates: CompiledHTMLType = await this.writer.generate(payload, compiledSettings);
      const compiled: DataSendType = this.getDataSendType(compiledTemplates, settings);
      return this.sendNotificationI.send(settings.channel, compiled);
    } catch (error) {
      defaultLogger.error('@oney/notification.ProcessNotification.processNotification.catch', error);
      throw error;
    }
  }

  private getDataSendType(template: CompiledHTMLType, settings: SettingsType): DataSendType {
    const dataSendType: DataSendType = {
      content: template.content,
      ..._.pick(template, ['footer']),
      ..._.pick(settings, ['path', 'pdfOptions', 'recipient', 'subject', 'from']),
    };
    return dataSendType;
  }
}
