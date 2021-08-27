import { Usecase } from '@oney/ddd';
import { injectable, inject } from 'inversify';
import { AuthSignatureVerificationFailedProps } from '@oney/authentication-messages';
import { Identifiers } from '../../di/Identifiers';
import { ProcessNotificationI } from '../../domain/services/ProcessNotificationI';
import { ChannelEnum } from '../../domain/types/ChannelEnum';
import { DataSendType } from '../../domain/types/DataSendType';

export interface SendAuthSignatureVerificationErrorNotificationRequest {
  uid: string;
  recipientEmail: string;
}

@injectable()
export class SendAuthSignatureVerificationErrorNotification
  implements Usecase<AuthSignatureVerificationFailedProps, DataSendType> {
  constructor(
    @inject(Identifiers.ProcessNotificationI)
    private readonly processNotificationI: ProcessNotificationI,
  ) {}

  async execute(req: AuthSignatureVerificationFailedProps): Promise<DataSendType> {
    //payload construction
    const payload = {
      ...req,
    };

    //build settings
    const settings = {
      contentBodyPath: `auth/email.fr.authSignatureVerificationErrorNotification.html`,
      recipient: req.recipient,
      subject: `Erreur de vérification de signature d'authentification`,
      channel: ChannelEnum.EMAIL,
    };

    if (!settings.recipient) {
      return;
    }

    return this.processNotificationI.processNotification(payload, settings);
  }
}
