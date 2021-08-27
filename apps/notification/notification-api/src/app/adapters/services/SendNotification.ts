import { defaultLogger } from '@oney/logger-adapters';
import { injectable } from 'inversify';
import { Configuration } from '../../config/config.env';
import { SendNotificationI } from '../../domain/services/SendNotificationI';
import { ChannelEnum } from '../../domain/types/ChannelEnum';
import { DataSendType } from '../../domain/types/DataSendType';
import { BusService } from '../../services/bus';

@injectable()
export class SendNotification implements SendNotificationI {
  private config = new Configuration();
  async send(channel: ChannelEnum, compiled: DataSendType): Promise<DataSendType> {
    const busService = new BusService(this.config.serviceBusConfiguration);
    const message = {
      body: compiled,
    };
    defaultLogger.info(`send builded payload for notification process, send to channel: ${channel}`);
    await busService.send(this.config.serviceBusConfiguration[channel], message);
    return message.body;
  }
}
