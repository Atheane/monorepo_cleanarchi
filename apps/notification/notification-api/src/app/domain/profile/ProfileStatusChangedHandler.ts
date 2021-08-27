import { defaultLogger } from '@oney/logger-adapters';
import { inject, injectable } from 'inversify';
import { DomainEventHandler } from '@oney/ddd';
import { ProfileStatusChanged } from '@oney/profile-messages';
import { Identifiers } from '../../di/Identifiers';
import { RefreshClient, RefreshClientCommand } from '../../usecase/RefreshClient';

@injectable()
export class ProfileStatusChangedHandler extends DomainEventHandler<ProfileStatusChanged> {
  constructor(@inject(Identifiers.RefreshClient) private refreshClient: RefreshClient) {
    super();
  }

  async handle(domainEvent: ProfileStatusChanged): Promise<void> {
    const { aggregateId, eventName } = domainEvent.metadata;
    defaultLogger.info(`Received ${eventName} for userId ${aggregateId}`);
    const refreshClientCommand: RefreshClientCommand = {
      userId: aggregateId,
      eventName: eventName,
      eventDate: new Date(),
      eventPayload: JSON.stringify(domainEvent),
    };
    await this.refreshClient.execute(refreshClientCommand);
  }
}
