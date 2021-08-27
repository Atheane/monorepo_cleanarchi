import { injectable } from 'inversify';
import { Transaction } from '@oney/pfm-core';
import { Mapper } from '@oney/common-core';

type TransactionResponse = {
  amount: number;
  originalAmount: number;
  fees?: number;
  isDeposit?: boolean;
};

@injectable()
export class TransactionMapper implements Mapper<Transaction, TransactionResponse> {
  fromDomain(transaction: Transaction): TransactionResponse {
    const { amount, originalAmount, fees, isDeposit } = transaction;
    return {
      ...transaction,
      amount: amount.value,
      originalAmount: originalAmount?.value ?? null,
      fees: fees?.value ?? null,
      isDeposit: isDeposit || false,
    };
  }
}
