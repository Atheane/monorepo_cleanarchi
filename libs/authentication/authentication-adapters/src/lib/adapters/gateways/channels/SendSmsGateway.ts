import { Channel, ChannelGateway } from '@oney/authentication-core';
import { injectable } from 'inversify';
import { ChannelMethod } from '../../decorators/channels';

@ChannelMethod(Channel.SMS)
@injectable()
export class SendSmsGateway implements ChannelGateway {
  async send(channel: Channel, payload?): Promise<boolean> {
    const smsOtp: string = payload;
    // eslint-disable-next-line no-console
    console.log(`sms code ${smsOtp} at ${new Date().toISOString()}`);
    return true;
  }
}
