import { Usecase } from '@oney/ddd';
import { defaultLogger } from '@oney/logger-adapters';
import { injectable } from 'inversify';
import send from '../../services/notifier/sms';

export interface SendOtpSmsRequest {
  code: string;
  phone: string;
}

type SendOtpSMSCommand = {
  content: string;
  recipient: string;
};

@injectable()
export class SendOtpSms implements Usecase<SendOtpSmsRequest, void> {
  async execute({ code, phone }: SendOtpSmsRequest) {
    try {
      defaultLogger.info(`Send OTP SMS to ${phone}`);

      const sendOtpSMSCommand: SendOtpSMSCommand = {
        content: `Oney Banque : ${code}. Pour valider votre telephone, merci de renseigner ce code confidentiel. Ne jamais le communiquer.`,
        recipient: phone,
      };

      await send(sendOtpSMSCommand);
    } catch (e) {
      defaultLogger.error(`Sending OTP SMS failed for ${phone}`, e);
      throw e;
    }
  }
}
