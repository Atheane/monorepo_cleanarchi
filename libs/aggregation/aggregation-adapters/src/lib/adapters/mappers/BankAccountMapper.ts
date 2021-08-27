import { inject, injectable } from 'inversify';
import { Mapper, Currency } from '@oney/common-core';
import {
  BankAccount,
  BankAccountProperties,
  AggregationIdentifier,
  BankConnection,
  BankAccountUsage,
} from '@oney/aggregation-core';
import { BudgetInsightBankAccountTypeMapper } from './BudgetInsightBankAccountTypeMapper';
import { BudgetInsightAccount } from '../partners/budgetinsights/models/BudgetInsightAccount';

@injectable()
export class BankAccountMapper implements Mapper<BankAccount> {
  constructor(
    @inject(AggregationIdentifier.budgetInsightBankAccountTypeMapper)
    private readonly budgetInsightBankAccountTypeMapper: BudgetInsightBankAccountTypeMapper,
  ) {}

  toDomain({
    raw,
    bankConnection,
  }: {
    raw: BudgetInsightAccount;
    bankConnection: BankConnection;
  }): BankAccount {
    /* istanbul ignore next: waiting for istanbul to support typescript optional chaining */
    const currency = Currency[raw.currency?.id];

    const bankAccountProps: BankAccountProperties = {
      id: raw.id.toString(),
      balance: raw.balance,
      name: raw.name,
      currency,
      aggregated: !raw.disabled,
      establishment: {
        name: raw.company_name,
      },
      number: raw.number,
      metadatas: {
        iban: raw.iban,
      },
      type: this.budgetInsightBankAccountTypeMapper.toDomain(raw.type),
      usage: BankAccountUsage[raw.usage],
      ownership: raw.ownership || undefined,
      connectionId: bankConnection.props.connectionId,
      bankId: bankConnection.props.bankId,
      userId: bankConnection.props.userId,
    };

    return new BankAccount(bankAccountProps);
  }
}
