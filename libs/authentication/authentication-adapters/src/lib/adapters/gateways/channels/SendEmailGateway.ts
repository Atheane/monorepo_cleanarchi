import { AuthIdentifier, BusDelivery, Channel, ChannelGateway } from '@oney/authentication-core';
import { inject, injectable } from 'inversify';
import { ChannelMethod } from '../../decorators/channels';

@ChannelMethod(Channel.EMAIL)
@injectable()
export class SendEmailGateway implements ChannelGateway {
  private readonly topicMagicLink: string = 'topic_odb-authentication_magic-link';

  constructor(@inject(AuthIdentifier.busDelivery) private readonly busDelivery: BusDelivery) {}

  async send(channel: Channel, payload): Promise<boolean> {
    // Listen for action trigger on verifier.
    await this.busDelivery.send(this.topicMagicLink, { ...payload, path: 'auth/sca' });
    return Promise.resolve(true);
  }
}
