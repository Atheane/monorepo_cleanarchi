import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { SctInReceived } from '@oney/payment-messages';
import { injectable } from 'inversify';

@injectable()
export class SctInReceivedHandler extends DomainEventHandler<SctInReceived> {
  public handle(domainEvent: SctInReceived): Promise<void> {
    return;
  }
}
