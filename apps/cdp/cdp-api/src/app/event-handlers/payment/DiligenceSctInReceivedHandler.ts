import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { DiligenceSctInReceived } from '@oney/payment-messages';
import { injectable } from 'inversify';

@injectable()
export class DiligenceSctInReceivedHandler extends DomainEventHandler<DiligenceSctInReceived> {
  public handle(domainEvent: DiligenceSctInReceived): Promise<void> {
    return;
  }
}
