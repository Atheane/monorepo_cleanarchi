import { GenericError } from '@oney/common-core';
import { SplitContractCreated } from '@oney/credit-messages';
import { DomainEventHandler } from '@oney/ddd';
import { injectable } from 'inversify';

@injectable()
export class SplitContractCreatedHandler extends DomainEventHandler<SplitContractCreated> {
  public handle(domainEvent: SplitContractCreated): Promise<void> {
    return;
  }
}
