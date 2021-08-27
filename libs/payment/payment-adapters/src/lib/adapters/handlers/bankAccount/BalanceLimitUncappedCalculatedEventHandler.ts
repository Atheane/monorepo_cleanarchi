import { DomainEventHandler } from '@oney/ddd';
import {
  UncapBankAccountUsingAggregatedAccounts,
  UncapBankAccountUsingAggregatedAccountsCommand,
} from '@oney/payment-core';
import { inject, injectable } from 'inversify';
import { Logger, SymLogger } from '@oney/logger-core';
import { CustomBalanceLimitCalculated } from '@oney/cdp-messages';

@injectable()
export class BalanceLimitUncappedCalculatedEventHandler extends DomainEventHandler<
  CustomBalanceLimitCalculated
> {
  constructor(
    @inject(UncapBankAccountUsingAggregatedAccounts)
    private readonly _uncapBankAccountUsingAggregatedAccounts: UncapBankAccountUsingAggregatedAccounts,

    @inject(SymLogger)
    private readonly logger: Logger,
  ) {
    super();
    this.logger = logger;
  }

  async handle(domainEvent: CustomBalanceLimitCalculated): Promise<void> {
    const command: UncapBankAccountUsingAggregatedAccountsCommand = {
      uId: domainEvent.props.uId,
      customBalanceLimit: domainEvent.props.customBalanceLimit,
      customBalanceLimitEligibility: domainEvent.props.customBalanceLimitEligibility,
    };
    await this._uncapBankAccountUsingAggregatedAccounts.execute(command);
  }
}
