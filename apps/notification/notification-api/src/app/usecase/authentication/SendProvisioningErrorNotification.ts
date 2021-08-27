import { Usecase } from '@oney/ddd';
import { injectable, inject } from 'inversify';
import { ProvisioningError } from '@oney/authentication-messages';
import { Identifiers } from '../../di/Identifiers';
import { ProcessNotificationI } from '../../domain/services/ProcessNotificationI';
import { ChannelEnum } from '../../domain/types/ChannelEnum';
import { DataSendType } from '../../domain/types/DataSendType';

export interface SendProvisioningErrorNotificationRequest {
  uid: string;
  recipientEmail: string;
}

@injectable()
export class SendProvisioningErrorNotification implements Usecase<ProvisioningError, DataSendType> {
  constructor(
    @inject(Identifiers.ProcessNotificationI)
    private readonly processNotificationI: ProcessNotificationI,
  ) {}

  async execute(req: ProvisioningError): Promise<DataSendType> {
    //payload construction
    const payload = {
      ...req,
      cause: req.cause.msg,
    };

    //build settings
    const settings = {
      contentBodyPath: `auth/email.fr.provisioningError.html`,
      recipient: req.recipient,
      subject: `Erreur de provisioning`,
      channel: ChannelEnum.EMAIL,
    };

    if (!settings.recipient) {
      return;
    }

    return this.processNotificationI.processNotification(payload, settings);
  }
}
