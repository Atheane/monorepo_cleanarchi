import { DomainEventHandler } from '@oney/ddd';
import { PhoneOtpUpdated } from '@oney/profile-messages';
import { inject, injectable } from 'inversify';
import { defaultLogger } from '@oney/logger-adapters';
import { Identifiers } from '../../di/Identifiers';
import { SendOtpSms, SendOtpSmsRequest } from '../../usecase/profile/SendOtpSms';

@injectable()
export class PhoneOtpUpdatedHandler extends DomainEventHandler<PhoneOtpUpdated> {
  private readonly usecase: SendOtpSms;

  constructor(@inject(Identifiers.SendOtpSms) usecase: SendOtpSms) {
    super();
    this.usecase = usecase;
  }

  async handle(domainEvent: PhoneOtpUpdated): Promise<void> {
    const { aggregateId } = domainEvent.metadata;
    defaultLogger.info(`Received PHONE_OTP_UPDATED for userId ${aggregateId}`);

    const sendOtpSmsRequest: SendOtpSmsRequest = {
      code: domainEvent.props.code,
      phone: domainEvent.props.phone,
    };

    await this.usecase.execute(sendOtpSmsRequest);
  }
}
