import { DomainEventHandler } from '@oney/ddd';
import { defaultLogger } from '@oney/logger-adapters';
import { PhoneOtpCreated } from '@oney/profile-messages';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../../di/Identifiers';
import { SendOtpSms, SendOtpSmsRequest } from '../../usecase/profile/SendOtpSms';

@injectable()
export class PhoneOtpCreatedHandler extends DomainEventHandler<PhoneOtpCreated> {
  private readonly usecase: SendOtpSms;

  constructor(@inject(Identifiers.SendOtpSms) usecase: SendOtpSms) {
    super();
    this.usecase = usecase;
  }

  async handle(domainEvent: PhoneOtpCreated): Promise<void> {
    const { aggregateId } = domainEvent.metadata;
    defaultLogger.info(`Received PHONE_OTP_CREATED for userId ${aggregateId}`);

    const sendOtpSmsRequest: SendOtpSmsRequest = {
      code: domainEvent.props.code,
      phone: domainEvent.props.phone,
    };

    await this.usecase.execute(sendOtpSmsRequest);
  }
}
