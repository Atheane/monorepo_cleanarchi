import { DomainEventHandler } from '@oney/ddd';
import { ProfileCreated } from '@oney/profile-messages';
import { EnrollSubscriber } from '@oney/subscription-core';
import { injectable } from 'inversify';

@injectable()
export class ProfileCreatedHandler extends DomainEventHandler<ProfileCreated> {
  constructor(private readonly createSubscriber: EnrollSubscriber) {
    super();
  }

  async handle(domainEvent: ProfileCreated): Promise<void> {
    await this.createSubscriber.execute({
      uid: domainEvent.metadata.aggregateId,
    });
    return;
  }
}
