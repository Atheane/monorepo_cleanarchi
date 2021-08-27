import { DataSendType } from '../types/DataSendType';
import { SettingsType } from '../types/SettingsType';

export interface ProcessNotificationI {
  processNotification(receive: any, setting: SettingsType): Promise<DataSendType>;
}
