import { Usecase } from '@oney/ddd';
import { defaultLogger } from '@oney/logger-adapters';
import { injectable, inject } from 'inversify';
import { CustomerServiceDemandSentProps } from '@oney/profile-messages';
import { Identifiers } from '../../di/Identifiers';
import { ProcessNotificationI } from '../../domain/services/ProcessNotificationI';
import { ChannelEnum } from '../../domain/types/ChannelEnum';
import { DataSendType } from '../../domain/types/DataSendType';
import { config } from '../../config/config.env';

@injectable()
export class SendCustomerServiceNotification
  implements Usecase<CustomerServiceDemandSentProps, DataSendType> {
  constructor(
    @inject(Identifiers.ProcessNotificationI)
    private readonly processNotificationI: ProcessNotificationI,
  ) {}

  async execute(props: CustomerServiceDemandSentProps): Promise<DataSendType> {
    try {
      //payload construction
      const payload = {
        ...props,
        birthname: props.birthname || '',
        demandDate: new Date().toLocaleString(),
      };

      //build settings
      const settings = {
        contentBodyPath: config.customerServiceEmailPath,
        recipient: config.customerServiceEmail,
        subject: `Oney+ ${props.topic}`,
        channel: ChannelEnum.EMAIL,
        from: props.email,
      };

      return this.processNotificationI.processNotification(payload, settings);
    } catch (error) {
      defaultLogger.error('@oney/notification.SendCustomerServiceNotification.execute.catch', error);
      throw error;
    }
  }
}
