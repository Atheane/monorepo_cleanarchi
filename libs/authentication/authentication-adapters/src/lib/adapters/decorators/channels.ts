import { Channel, ChannelGateway } from '@oney/authentication-core';
import { injectable } from 'inversify';

export const channels = new Map<string, any>();

@injectable()
export abstract class ChannelBase implements ChannelGateway {
  abstract send(channel: Channel, payload?: any): Promise<boolean>;
}

export function ChannelMethod(channel: Channel) {
  return (target: any) => {
    channels.set(channel, target);
  };
}
