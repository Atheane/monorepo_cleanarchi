import { GenericError } from '@oney/common-core';
import { SplitContractClosed } from '@oney/credit-messages';
import { DomainEventHandler } from '@oney/ddd';
import { injectable } from 'inversify';

@injectable()
export class SplitContractClosedHandler extends DomainEventHandler<SplitContractClosed> {
  public handle(domainEvent: SplitContractClosed): Promise<void> {
    return;
  }
}
