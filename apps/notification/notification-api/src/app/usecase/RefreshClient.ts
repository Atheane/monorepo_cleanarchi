import { Usecase } from '@oney/ddd';
import { defaultLogger } from '@oney/logger-adapters';
import { Notification } from '@oney/notification-messages';
import { injectable } from 'inversify';
import send from '../services/notifier/push';

/**
 * userId: User id to be notified
 * eventId: id of DomainEvent received by odb_notification
 * eventName: name of DomainEvent received by odb_notification
 * eventVersion: version of DomainEvent received by odb_notification
 * eventDate: Date of event
 * eventPayload: props of DomainEvent received by odb_notification.
 * Use JSON.stringify() to transform. To be used only when it's domain event
 */
export interface RefreshClientCommand {
  userId: string;
  eventId?: string;
  eventName: string;
  eventVersion?: number;
  eventDate: Date;
  eventPayload?: string;
}

export type RefreshClientCommandResult = {
  notification: Notification;
  userIds: string[];
  isSilent: boolean;
};

@injectable()
export class RefreshClient implements Usecase<RefreshClientCommand, RefreshClientCommandResult> {
  async execute(refreshClientCommand: RefreshClientCommand) {
    try {
      const { userId, eventPayload, eventName, eventDate, eventId, eventVersion } = refreshClientCommand;
      defaultLogger.info(`Requesting client refresh for user ${userId}`);

      const refreshClientRequest: RefreshClientCommandResult = {
        userIds: [userId],
        notification: {
          data: {
            eventName: eventName,
            eventDate: eventDate,
            eventPayload: eventPayload,
            ...(eventId && { eventId }),
            ...(eventVersion && { eventVersion }),
          },
        },
        isSilent: true,
      };

      await send(refreshClientRequest);

      defaultLogger.info(`Client refresh request is sent for user ${userId}`);

      return refreshClientRequest;
    } catch (e) {
      defaultLogger.error(`Client refresh request failed`, e);
      throw e;
    }
  }
}
