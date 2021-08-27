import { DomainEventHandler } from '@oney/ddd';
import { ProfileStatus, ProfileActivated } from '@oney/profile-messages';
import { ActivateSubscriber } from '@oney/subscription-core';
import { injectable } from 'inversify';

@injectable()
export class ProfileActivatedHandler extends DomainEventHandler<ProfileActivated> {
  constructor(private readonly activateSubscriber: ActivateSubscriber) {
    super();
  }

  async handle(domainEvent: ProfileActivated): Promise<void> {
    const {
      props: { profileStatus },
      metadata: { aggregateId },
    } = domainEvent;
    await this.activateSubscriber.execute({
      uid: aggregateId,
      isValidated: profileStatus === ProfileStatus.ACTIVE,
    });
    return;
  }
}
