import { Usecase } from '@oney/ddd';
import { defaultLogger } from '@oney/logger-adapters';
import { injectable, inject } from 'inversify';
import { TransferCreatedProps } from '@oney/payment-messages';
import { Identifiers } from '../../di/Identifiers';
import { ProcessNotificationI } from '../../domain/services/ProcessNotificationI';
import { ChannelEnum } from '../../domain/types/ChannelEnum';
import { DataSendType } from '../../domain/types/DataSendType';
import { RecipientRepository } from '../../domain/repositories/RecipientRepository';

@injectable()
export class SendTransferNotification implements Usecase<TransferCreatedProps, DataSendType> {
  constructor(
    @inject(Identifiers.ProcessNotificationI)
    private readonly processNotificationI: ProcessNotificationI,
    @inject(Identifiers.RecipientRepository)
    private readonly recipientRepository: RecipientRepository,
  ) {}

  async execute(transferCreatedProperties: TransferCreatedProps): Promise<DataSendType> {
    try {
      // Retrieve issuer name
      const recipient = await this.recipientRepository.findBy(transferCreatedProperties.sender.uid);

      //payload construction
      const payload = {
        ...transferCreatedProperties,
        issuer: {
          firstName: recipient.props.profile.firstName,
          lastName: recipient.props.profile.lastName,
        },
      };

      //build settings
      const settings = {
        contentBodyPath: `transferNotification/email.fr.create_transfer.html`,
        recipient: transferCreatedProperties.recipientEmail,
        subject: 'Vous avez reçu un virement',
        channel: ChannelEnum.EMAIL,
      };

      if (!settings.recipient) {
        return;
      }

      return this.processNotificationI.processNotification(payload, settings);
    } catch (error) {
      defaultLogger.error('@oney/notification.SendTransferNotification.execute.catch', error);
      throw error;
    }
  }
}
