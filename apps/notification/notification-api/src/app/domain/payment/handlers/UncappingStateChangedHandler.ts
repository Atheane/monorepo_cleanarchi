import { DomainEventHandler } from '@oney/ddd';
import { defaultLogger } from '@oney/logger-adapters';
import { UncappingStateChanged } from '@oney/payment-messages';
import { inject } from 'inversify';
import { ConsentUpdated } from '@oney/profile-messages';
import { Identifiers } from '../../../di/Identifiers';
import { RefreshClient, RefreshClientCommand } from '../../../usecase/RefreshClient';

export class UncappingStateChangedHandler extends DomainEventHandler<UncappingStateChanged> {
  constructor(@inject(Identifiers.RefreshClient) private refreshClient: RefreshClient) {
    super();
  }

  async handle(domainEvent: UncappingStateChanged): Promise<void> {
    const { aggregateId } = domainEvent.metadata;
    defaultLogger.info(`Received ${UncappingStateChanged.name} event`, domainEvent);
    const refreshClientCommand: RefreshClientCommand = {
      userId: aggregateId,
      eventName: ConsentUpdated.name,
      eventDate: new Date(),
      eventPayload: JSON.stringify(domainEvent),
    };
    await this.refreshClient.execute(refreshClientCommand);
  }
}
