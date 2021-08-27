import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { FiscalStatusValidated } from '@oney/profile-messages';
import { injectable } from 'inversify';

@injectable()
export class FiscalStatusValidatedHandler extends DomainEventHandler<FiscalStatusValidated> {
  public handle(domainEvent: FiscalStatusValidated): Promise<void> {
    return;
  }
}
