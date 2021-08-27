import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { SctInReceived } from '@oney/payment-messages';

export class SctInReceivedHandler extends DomainEventHandler<SctInReceived> {
  public handle(domainEvent: SctInReceived): Promise<void> {
    throw new GenericError.MethodNotImplemented(`${SctInReceivedHandler.name}.handle`);
  }
}
