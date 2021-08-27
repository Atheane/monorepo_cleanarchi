import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { UserKycDecisionUpdated } from '@oney/profile-messages';
import { injectable } from 'inversify';

@injectable()
export class UserKycDecisionUpdatedHandler extends DomainEventHandler<UserKycDecisionUpdated> {
  public handle(domainEvent: UserKycDecisionUpdated): Promise<void> {
    return;
  }
}
