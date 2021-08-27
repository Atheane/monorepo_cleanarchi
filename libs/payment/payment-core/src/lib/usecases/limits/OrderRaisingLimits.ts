import { Usecase } from '@oney/ddd';
import { EventDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { CheckAggregatedAccountsIncomes } from '@oney/payment-messages';

export interface OrderRaisingLimitsCommand {
  uid: string;
}

@injectable()
export class OrderRaisingLimits implements Usecase<OrderRaisingLimitsCommand, void> {
  constructor(@inject(EventDispatcher) private readonly _eventDispatcher: EventDispatcher) {}

  async execute(command: OrderRaisingLimitsCommand): Promise<void> {
    const event = new CheckAggregatedAccountsIncomes({ ...command });
    await this._eventDispatcher.dispatch(event);
  }
}
