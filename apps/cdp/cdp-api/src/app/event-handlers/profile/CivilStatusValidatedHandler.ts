import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { CivilStatusValidated } from '@oney/profile-messages';
import { injectable } from 'inversify';

@injectable()
export class CivilStatusValidatedHandler extends DomainEventHandler<CivilStatusValidated> {
  public handle(domainEvent: CivilStatusValidated): Promise<void> {
    return;
  }
}
