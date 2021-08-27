import { GenericError } from '@oney/common-core';
import { SplitSimulationValidated } from '@oney/credit-messages';
import { DomainEventHandler } from '@oney/ddd';
import { injectable } from 'inversify';

@injectable()
export class SplitSimulationValidatedHandler extends DomainEventHandler<SplitSimulationValidated> {
  public handle(domainEvent: SplitSimulationValidated): Promise<void> {
    return;
  }
}
