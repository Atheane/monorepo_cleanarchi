import { Channel, Payload } from '@oney/authentication-core';
import { Container, injectable } from 'inversify';
import { Reflection } from '../../../di/Reflection';
import { ChannelBase } from '../../decorators/channels';
import './SendEmailGateway';
import './SendSmsGateway';

@injectable()
export class ChannelHandlerGateway implements ChannelBase {
  container: Container;

  constructor(container: Container) {
    this.container = container;
  }

  async send<T>(channel: Channel, payload?: Payload<T>): Promise<boolean> {
    const channelClassInstance = Reflection.getChannelClassInstance(channel);
    const channelBase = this.container.resolve<ChannelBase>(channelClassInstance);
    await channelBase.send(channel, payload);
    return true;
  }
}
