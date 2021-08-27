import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { EkycUpdated } from '@oney/payment-messages';
import { injectable } from 'inversify';

@injectable()
export class EkycUpdatedHandler extends DomainEventHandler<EkycUpdated> {
  public handle(domainEvent: EkycUpdated): Promise<void> {
    return;
  }
}
