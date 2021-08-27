import { DomainEventHandler } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { CheckToEvaluateAccount, CheckToEvaluateAccountCommand } from '@oney/payment-core';
import { AggregatedAccountsIncomesChecked } from '@oney/cdp-messages';

@injectable()
export class AggregatedAccountsIncomesCheckedEventHandler extends DomainEventHandler<
  AggregatedAccountsIncomesChecked
> {
  constructor(
    @inject(CheckToEvaluateAccount)
    private readonly _checkAccountsEvaluating: CheckToEvaluateAccount,
  ) {
    super();
  }

  async handle(domainEvent: AggregatedAccountsIncomesChecked): Promise<void> {
    const command: CheckToEvaluateAccountCommand = {
      uid: domainEvent.props.uid,
      aggregatedAccounts: domainEvent.props.verifications,
    };
    await this._checkAccountsEvaluating.execute(command);
  }
}
