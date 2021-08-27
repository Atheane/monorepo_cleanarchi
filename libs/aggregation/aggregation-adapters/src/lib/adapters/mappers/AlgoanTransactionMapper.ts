import { inject, injectable } from 'inversify';
import { Mapper, Currency } from '@oney/common-core';
import {
  TransactionProperties as AlgoanTransactionProperties,
  Transaction as AlgoanTransaction,
} from '@oney/algoan';
import {
  AggregationIdentifier,
  Transaction,
  TransactionCategory,
  TransactionProperties,
} from '@oney/aggregation-core';
import { AlgoanTransactionTypeMapper } from './AlgoanTransactionTypeMapper';

@injectable()
export class AlgoanTransactionMapper implements Mapper<Transaction> {
  constructor(
    @inject(AggregationIdentifier.algoanTransactionTypeMapper)
    private readonly algoanTransactionTypeMapper: AlgoanTransactionTypeMapper,
  ) {}

  toDomain(raw: AlgoanTransaction): Transaction {
    const transactionProperties: TransactionProperties = {
      id: raw.id,
      bankAccountId: raw.reference,
      creditDecisioningAccountId: raw.accountId,
      amount: raw.amount,
      date: new Date(raw.date),
      currency: Currency[raw.currency],
      type: this.algoanTransactionTypeMapper.toDomain(raw.type),
      label: raw.description,
      category: raw.algoanCategory ? TransactionCategory[raw.algoanCategory] : undefined,
    };

    return new Transaction(transactionProperties);
  }

  fromDomain({
    props: transactionProps,
    accountId,
  }: Transaction & { accountId: string }): AlgoanTransactionProperties {
    const algoanTransaction: AlgoanTransactionProperties = {
      amount: transactionProps.amount,
      date: transactionProps.date,
      category: 'category',
      description: transactionProps.label,
      type: this.algoanTransactionTypeMapper.fromDomain(transactionProps.type),
      currency: transactionProps.currency,
      reference: transactionProps.bankAccountId,
      accountId,
    };
    return algoanTransaction;
  }
}
