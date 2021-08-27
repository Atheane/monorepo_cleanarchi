import { Notification } from './Notification';

export type RefreshClientRequestedProperties = {
  notification: Notification;
  userIds: string[];
  isSilent: boolean;
};
