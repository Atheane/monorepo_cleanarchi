import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { PhoneStepValidated } from '@oney/profile-messages';
import { injectable } from 'inversify';

@injectable()
export class PhoneStepValidatedHandler extends DomainEventHandler<PhoneStepValidated> {
  public handle(domainEvent: PhoneStepValidated): Promise<void> {
    return;
  }
}
