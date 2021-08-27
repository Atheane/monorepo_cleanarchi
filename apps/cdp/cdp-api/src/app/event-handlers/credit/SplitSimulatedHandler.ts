import { GenericError } from '@oney/common-core';
import { SplitSimulated } from '@oney/credit-messages';
import { DomainEventHandler } from '@oney/ddd';
import { injectable } from 'inversify';

@injectable()
export class SplitSimulatedHandler extends DomainEventHandler<SplitSimulated> {
  public handle(domainEvent: SplitSimulated): Promise<void> {
    return;
  }
}
