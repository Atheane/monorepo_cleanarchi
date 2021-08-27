import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { ProfileActivated } from '@oney/profile-messages';
import { injectable } from 'inversify';

@injectable()
export class ProfileActivatedHandler extends DomainEventHandler<ProfileActivated> {
  public handle(domainEvent: ProfileActivated): Promise<void> {
    return;
  }
}
