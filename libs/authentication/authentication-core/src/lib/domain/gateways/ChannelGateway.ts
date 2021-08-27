import { Channel, Payload } from '../types/Channel';

export interface ChannelGateway {
  send<T>(channel: Channel, payload?: Payload<T>): Promise<boolean>;
}
