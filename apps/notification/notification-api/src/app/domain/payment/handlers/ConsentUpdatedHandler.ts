import { DomainEventHandler } from '@oney/ddd';
import { defaultLogger } from '@oney/logger-adapters';
import { ConsentUpdated } from '@oney/profile-messages';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../../../di/Identifiers';
import { RefreshClient, RefreshClientCommand } from '../../../usecase/RefreshClient';

@injectable()
export class ConsentUpdatedHandler extends DomainEventHandler<ConsentUpdated> {
  constructor(@inject(Identifiers.RefreshClient) private refreshClient: RefreshClient) {
    super();
  }

  async handle(domainEvent: ConsentUpdated): Promise<void> {
    const { aggregateId } = domainEvent.metadata;
    defaultLogger.info(`Received ${ConsentUpdated.name} event`, domainEvent);
    const refreshClientCommand: RefreshClientCommand = {
      userId: aggregateId,
      eventName: ConsentUpdated.name,
      eventDate: new Date(),
      eventPayload: JSON.stringify(domainEvent),
    };
    await this.refreshClient.execute(refreshClientCommand);
  }
}
