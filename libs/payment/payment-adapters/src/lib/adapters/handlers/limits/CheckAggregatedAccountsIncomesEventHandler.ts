import { CheckAggregatedAccountsIncomes } from '@oney/payment-messages';
import { DomainEventHandler } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { AskUncapping, AskUncappingCommand, UncappingReason } from '@oney/payment-core';

@injectable()
export class CheckAggregatedAccountsIncomesEventHandler extends DomainEventHandler<
  CheckAggregatedAccountsIncomes
> {
  constructor(@inject(AskUncapping) private readonly _askUncapping: AskUncapping) {
    super();
  }

  async handle(domainEvent: CheckAggregatedAccountsIncomes): Promise<void> {
    const command: AskUncappingCommand = { uid: domainEvent.props.uid, reason: UncappingReason.AGGREGATION };
    await this._askUncapping.execute(command);
  }
}
