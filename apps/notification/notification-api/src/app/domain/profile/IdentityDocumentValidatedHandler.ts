import { DomainEventHandler } from '@oney/ddd';
import { defaultLogger } from '@oney/logger-adapters';
import { IdentityDocumentValidated } from '@oney/profile-messages';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../../di/Identifiers';
import { RefreshClient, RefreshClientCommand } from '../../usecase/RefreshClient';

@injectable()
export class IdentityDocumentValidatedHandler extends DomainEventHandler<IdentityDocumentValidated> {
  constructor(@inject(Identifiers.RefreshClient) private refreshClient: RefreshClient) {
    super();
  }

  async handle(domainEvent: IdentityDocumentValidated): Promise<void> {
    const { aggregateId } = domainEvent.metadata;
    defaultLogger.info(`Received IDENTITY_DOCUMENT_VALIDATED for userId ${aggregateId}`);
    const refreshClientCommand: RefreshClientCommand = {
      userId: aggregateId,
      eventName: 'IDENTITY_DOCUMENT_VALIDATED',
      eventDate: new Date(),
      eventPayload: JSON.stringify(domainEvent),
    };
    await awaitTipsGeneration(2000); // CDP needs 2s to compute new tip
    await this.refreshClient.execute(refreshClientCommand);
  }
}

function awaitTipsGeneration(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
