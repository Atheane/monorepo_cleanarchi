import { ChannelEnum } from '../types/ChannelEnum';
import { DataSendType } from '../types/DataSendType';

export interface SendNotificationI {
  send(channel: ChannelEnum, compiled: DataSendType): Promise<DataSendType>;
}
