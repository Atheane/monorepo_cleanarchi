import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { UserFacematchValidated } from '@oney/profile-messages';
import { injectable } from 'inversify';

@injectable()
export class UserFacematchValidatedHandler extends DomainEventHandler<UserFacematchValidated> {
  public handle(domainEvent: UserFacematchValidated): Promise<void> {
    return;
  }
}
