import { injectable } from 'inversify';
import { Transaction } from '@oney/pfm-core';
import { Mapper } from '@oney/common-core';

type TransactionResponse = {
  amount: number;
  originalAmount: number;
  fees?: number;
};

@injectable()
export class TransactionMapper implements Mapper<Transaction, TransactionResponse> {
  fromDomain(transaction: Transaction): TransactionResponse {
    const { amount, originalAmount, fees } = transaction;
    return {
      ...transaction,
      amount: amount.value,
      originalAmount: originalAmount?.value ?? null,
      fees: fees?.value,
    };
  }
}
