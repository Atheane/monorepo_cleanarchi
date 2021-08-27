import { injectable } from 'inversify';
import {
  Direction,
  TransactionStatus,
  TransactionType,
  Card,
  CardTransaction,
  CounterParty,
  NonCardTransaction,
  Transaction,
} from '@oney/pfm-core';
import { Currency, Mapper, getEnumKeyByEnumValue } from '@oney/common-core';
import { TransactionBudgetInsight, TransactionTypeBudgetInsight } from '../models/transaction/BudgetInsight';

@injectable()
export class TransactionBudgetInsightMapper implements Mapper<Transaction> {
  toDomain({ value, original_value, commission, ...rawTransaction }: TransactionBudgetInsight): Transaction {
    let type: TransactionType;
    switch (rawTransaction.type) {
      case getEnumKeyByEnumValue(
        TransactionTypeBudgetInsight,
        TransactionTypeBudgetInsight.TRANSFER,
      ).toLowerCase():
        type = TransactionType.TRANSFER;
        break;
      case getEnumKeyByEnumValue(
        TransactionTypeBudgetInsight,
        TransactionTypeBudgetInsight.ORDER,
      ).toLowerCase():
        type = TransactionType.ORDER;
        break;
      case getEnumKeyByEnumValue(
        TransactionTypeBudgetInsight,
        TransactionTypeBudgetInsight.CHECK,
      ).toLowerCase():
        type = TransactionType.CHECK;
        break;
      case getEnumKeyByEnumValue(
        TransactionTypeBudgetInsight,
        TransactionTypeBudgetInsight.DEPOSIT,
      ).toLowerCase():
        type = TransactionType.TRANSFER;
        break;
      case getEnumKeyByEnumValue(
        TransactionTypeBudgetInsight,
        TransactionTypeBudgetInsight.PAYBACK,
      ).toLowerCase():
        type = TransactionType.PAYBACK;
        break;
      case getEnumKeyByEnumValue(
        TransactionTypeBudgetInsight,
        TransactionTypeBudgetInsight.WITHDRAWAL,
      ).toLowerCase():
        type = TransactionType.ATM;
        break;
      case getEnumKeyByEnumValue(
        TransactionTypeBudgetInsight,
        TransactionTypeBudgetInsight.LOAD_PAYMENT,
      ).toLowerCase():
        type = TransactionType.LOAN;
        break;
      case getEnumKeyByEnumValue(
        TransactionTypeBudgetInsight,
        TransactionTypeBudgetInsight.BANK,
      ).toLowerCase():
        type = TransactionType.FEES;
        break;
      case getEnumKeyByEnumValue(
        TransactionTypeBudgetInsight,
        TransactionTypeBudgetInsight.CARD,
      ).toLowerCase():
        type = TransactionType.CARD;
        break;
      case getEnumKeyByEnumValue(
        TransactionTypeBudgetInsight,
        TransactionTypeBudgetInsight.DEFERRED_CARD,
      ).toLowerCase():
        type = TransactionType.DEFERRED;
        break;
      case getEnumKeyByEnumValue(
        TransactionTypeBudgetInsight,
        TransactionTypeBudgetInsight.SUMMARY_CARD,
      ).toLowerCase():
        type = TransactionType.DEFERRED_SUMMARY;
        break;
    }

    const transaction = new Transaction({
      refId: String(rawTransaction.id),
      bankAccountId: String(rawTransaction.id_account),
      amount: value,
      originalAmount: original_value,
      date: rawTransaction.rdate,
      conversionRate: null,
      currency: rawTransaction.original_currency ? Currency[rawTransaction.original_currency.id] : null,
      direction: value > 0 ? Direction.IN : Direction.OUT,
      rejectionReason: null,
      status: rawTransaction.coming ? TransactionStatus.PENDING : TransactionStatus.CLEARED,
      type,
      label: [TransactionType.TRANSFER, TransactionType.ORDER].includes(type)
        ? rawTransaction.original_wording
        : rawTransaction.simplified_wording,
      fees: commission,
      isDeposit: false,
    });
    const card: Pick<Card, 'cardId' | 'pan' | 'merchant'> = {
      cardId: null,
      pan: rawTransaction.card,
      merchant: null,
    };
    const counterParty: Pick<CounterParty, 'id' | 'iban' | 'fullname'> = {
      id: null,
      iban: null,
      fullname: rawTransaction.counterparty,
    };
    return transaction.type === TransactionType.CARD
      ? new CardTransaction(transaction, card)
      : new NonCardTransaction(transaction, counterParty);
  }
}
