import { AccountStatementState, DirectionAmount, TransactionStatus, TransactionType } from '../../types';
import { AccountStatement } from '../../entities';

export class State {
  private readonly state: AccountStatementState;
  private readonly fromBalance: DirectionAmount;
  private readonly toBalance: DirectionAmount;

  constructor(accountStatement: AccountStatement, transactions: any[], dateFrom: Date, dateTo: Date) {
    let fromBalance = 0;
    let toBalance = 0;
    for (const transaction of transactions) {
      let transactionDate;
      if (AccountStatement.isSctOperation(transaction)) {
        transactionDate = new Date(transaction.date).getTime();
      } else if (transaction.clearingDate) {
        transactionDate = new Date(transaction.clearingDate).getTime();
      }
      if (!transactionDate) {
        continue;
      }
      if (transactionDate > dateTo.getTime()) {
        continue;
      }
      if (
        transaction.status === TransactionStatus.CLEARED ||
        transaction.status === TransactionStatus.REFUND ||
        transaction.type === TransactionType.TRANSFER ||
        transaction.type === TransactionType.ORDER
      ) {
        if (transactionDate < dateFrom.getTime()) {
          fromBalance += AccountStatement.isDebitOperation(transaction)
            ? -transaction.amount
            : transaction.amount;
        }
        if (transactionDate < dateTo.getTime()) {
          toBalance += AccountStatement.isDebitOperation(transaction)
            ? -transaction.amount
            : transaction.amount;
        }
      }
    }

    this.fromBalance = AccountStatement.getBalance(fromBalance);
    this.toBalance = AccountStatement.getBalance(toBalance);
    if (
      this.fromBalance.direction === accountStatement.props.fromBalance.direction &&
      this.fromBalance.amount === accountStatement.props.fromBalance.amount &&
      this.toBalance.direction === accountStatement.props.toBalance.direction &&
      this.toBalance.amount === accountStatement.props.toBalance.amount
    ) {
      this.state = AccountStatementState.VERIFIED;
    } else {
      this.state = AccountStatementState.UNVERIFIED;
    }
  }

  get value(): AccountStatementState {
    return this.state;
  }

  get balance(): { fromBalance: DirectionAmount; toBalance: DirectionAmount } {
    return {
      fromBalance: this.fromBalance,
      toBalance: this.toBalance,
    };
  }
}
