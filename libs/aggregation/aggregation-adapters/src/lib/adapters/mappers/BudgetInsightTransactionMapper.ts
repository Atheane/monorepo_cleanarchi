import { injectable } from 'inversify';
import { Mapper, Currency, TransactionType } from '@oney/common-core';
import { Transaction } from '@oney/aggregation-core';
import { BudgetInsightTransaction, BudgetInsightTransactionType } from '../partners/budgetinsights/models';

@injectable()
export class BudgetInsightTransactionMapper implements Mapper<Transaction> {
  toDomain(raw: BudgetInsightTransaction): Transaction {
    const {
      id,
      id_account: bankAccountId,
      value,
      rdate,
      original_currency: currency,
      type: rawType,
      original_wording: label,
    } = raw;
    let type: TransactionType;
    switch (rawType) {
      case BudgetInsightTransactionType.TRANSFER:
        type = TransactionType.TRANSFER;
        break;
      case BudgetInsightTransactionType.ORDER:
        type = TransactionType.ORDER;
        break;
      case BudgetInsightTransactionType.CHECK:
        type = TransactionType.CHECK;
        break;
      case BudgetInsightTransactionType.DEPOSIT:
        type = TransactionType.ATM;
        break;
      case BudgetInsightTransactionType.PAYBACK:
        type = TransactionType.PAYBACK;
        break;
      case BudgetInsightTransactionType.WITHDRAWAL:
        type = TransactionType.ATM;
        break;
      case BudgetInsightTransactionType.LOAN_PAYMENT:
        type = TransactionType.LOAN;
        break;
      case BudgetInsightTransactionType.BANK:
        type = TransactionType.FEES;
        break;
      case BudgetInsightTransactionType.CARD:
        type = TransactionType.CARD;
        break;
      case BudgetInsightTransactionType.DEFERRED_CARD:
        type = TransactionType.CARD;
        break;
      case BudgetInsightTransactionType.SUMMARY_CARD:
        type = TransactionType.CARD;
        break;
      default:
        break;
    }
    return new Transaction({
      id: id.toString(),
      bankAccountId: bankAccountId.toString(),
      amount: value,
      date: new Date(rdate),
      currency: Currency[currency?.id] || Currency.EUR,
      type,
      label,
    });
  }
}
