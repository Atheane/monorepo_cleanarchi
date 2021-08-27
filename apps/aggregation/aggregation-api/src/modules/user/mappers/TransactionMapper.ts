import { Mapper } from '@oney/common-core';
import { Transaction } from '@oney/aggregation-core';
import { injectable } from 'inversify';
import { ITransaction } from '../dto/ITransaction';

@injectable()
export class TransactionMapper implements Mapper<Transaction> {
  fromDomain(transaction: Transaction): ITransaction {
    return transaction.props;
  }
}
