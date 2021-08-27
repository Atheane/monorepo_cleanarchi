import { DomainEventHandler } from '@oney/ddd';
import { defaultLogger } from '@oney/logger-adapters';
import { ProfileActivated } from '@oney/profile-messages';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../../di/Identifiers';
import { RefreshClient, RefreshClientCommand } from '../../usecase/RefreshClient';

@injectable()
export class ProfileActivatedHandler extends DomainEventHandler<ProfileActivated> {
  private readonly usecase: RefreshClient;

  constructor(@inject(Identifiers.RefreshClient) usecase: RefreshClient) {
    super();
    this.usecase = usecase;
  }

  async handle(domainEvent: ProfileActivated): Promise<void> {
    const { aggregateId } = domainEvent.metadata;
    defaultLogger.info(`Received PROFILE_ACTIVATED for userId ${aggregateId}`);
    const refreshClientCommand: RefreshClientCommand = {
      userId: aggregateId,
      eventName: 'PROFILE_ACTIVATED',
      eventDate: new Date(),
      eventPayload: JSON.stringify({}),
    };
    await awaitTipsGeneration(2000); // CDP needs 2s to compute new tip
    await this.usecase.execute(refreshClientCommand);
  }
}

function awaitTipsGeneration(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
