import { Currency } from '@oney/common-core';
import {
  AccountStatementProperties,
  AccountStatementState,
  DirectionAmount,
  Operation,
  TransactionDirection,
  TransactionStatus,
  TransactionType,
} from '../types';
import { AmountPositive } from '../valueobjects/AmountPositive';

// TO-DO remove all credit type
type CreditParams = {
  initialTransactionId: string;
  transactionIds: {
    [key: string]: {
      key: string;
      contractNumber: string;
      productCode: string;
    };
  };
};

const ScheduleKey = {
  FEE: 'fee',
  FUNDING: 'funding',
  M1: '001',
  M2: '002',
  M3: '003',
  M4: '004',
};

const CreditKeyMonth = {
  '001': 1,
  '002': 2,
  '003': 3,
  '004': 4,
};

const ProductCodeMonth = {
  DF003: 3,
  DF004: 4,
};

export class AccountStatement {
  readonly props: AccountStatementProperties;

  constructor({
    transactions,
    dateFrom,
    dateTo,
    uid,
    currentBalance,
    credits,
  }: {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    transactions: any[];
    dateFrom: Date;
    dateTo: Date;
    uid: string;
    currentBalance: AmountPositive;
    credits: CreditParams[];
  }) {
    const segregatedOperations = AccountStatement.getSegregatedOperations(transactions, dateFrom, dateTo);
    this.props = {
      dateFrom,
      dateTo,
      uid,
      operations: this.getLinkCreditOperations(segregatedOperations, credits),
      documentState: AccountStatementState.UNKNOWN,
      documentAvailable: false,
    };

    let allCreditsSignedAmount = 0;
    let creditsOperationsCount = 0;
    let allDebitsSignedAmount = 0;
    let debitsOperationsCount = 0;
    let allCopSignedAmount = 0;
    let allSctOutSignedAmount = 0;
    let allSctInSignedAmount = 0;
    let allAtmSignedAmount = 0;

    for (let key = 0; key < this.props.operations.length; key += 1) {
      const op = this.props.operations[key];
      const amount = AccountStatement.getSignedValue(op);
      if (AccountStatement.isDebitOperation(op)) {
        allDebitsSignedAmount += amount;
        debitsOperationsCount += 1;
      }
      if (AccountStatement.isCreditOperation(op)) {
        allCreditsSignedAmount += amount;
        creditsOperationsCount += 1;
      }
      if (AccountStatement.isCopOperation(op)) {
        allCopSignedAmount += amount;
      }
      if (AccountStatement.isSctOutOperation(op)) {
        allSctOutSignedAmount += amount;
      }
      if (AccountStatement.isSctInOperation(op)) {
        allSctInSignedAmount += amount;
      }
      if (AccountStatement.isAtmOperation(op)) {
        allAtmSignedAmount += amount;
      }
      this.props.operations[key].description = AccountStatement.getDescription(op);
    }
    this.props.allCredits = AccountStatement.getAllCredits(allCreditsSignedAmount, creditsOperationsCount);
    this.props.allDebits = AccountStatement.getAllDebits(allDebitsSignedAmount, debitsOperationsCount);
    this.props.allCop = AccountStatement.getAllCop(allCopSignedAmount);
    this.props.allSctOut = AccountStatement.getAllSctOut(allSctOutSignedAmount);
    this.props.allSctIn = AccountStatement.getAllSctIn(allSctInSignedAmount);
    this.props.allAtm = AccountStatement.getAllAtm(allAtmSignedAmount);
    this.props.fromBalance = AccountStatement.getBalance(
      this.getBalance(transactions, dateFrom, currentBalance.value),
    );
    this.props.toBalance = AccountStatement.getBalance(
      AccountStatement.getSignedValue(this.props.fromBalance) +
        allCreditsSignedAmount +
        allDebitsSignedAmount,
    );
  }

  private getLinkedCredit(transactionId: string, credits: CreditParams[]): CreditParams | undefined {
    return credits.find(c => c.transactionIds[transactionId]);
  }

  private getLinkCreditOperations(operations: Operation[], credits: CreditParams[]): Operation[] {
    const linkCreditOperations: Operation[] = [];
    for (const operation of operations) {
      if (linkCreditOperations.find(o => o.transactionId === operation.transactionId)) {
        continue;
      }
      const linkedCredit = this.getLinkedCredit(operation.transactionId, credits);
      if (linkedCredit) {
        Object.keys(linkedCredit.transactionIds).map(key => {
          const value = linkedCredit.transactionIds[key];
          const findedOperation = operations.find(o => o.transactionId === key);
          if (
            findedOperation &&
            !linkCreditOperations.find(o => o.transactionId === findedOperation.transactionId)
          ) {
            const payload: Operation = {
              ...findedOperation,
              credit: {
                ...value,
                initialTransactionId: linkedCredit.initialTransactionId,
                monthTotal: ProductCodeMonth[value.productCode],
              },
            };
            if (CreditKeyMonth[value.key]) {
              payload.credit.monthPaid = CreditKeyMonth[value.key];
              payload.credit.monthToPaid = ProductCodeMonth[value.productCode] - CreditKeyMonth[value.key];
            }
            linkCreditOperations.push(payload);
          }
        });
      } else {
        linkCreditOperations.push(operation);
      }
    }

    return linkCreditOperations;
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  private static getSegregatedOperations(transactions: any[], dateFrom: Date, dateTo: Date): Operation[] {
    const segregatedOperations: Operation[] = [];

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
      if (transactionDate < dateFrom.getTime()) {
        continue;
      }
      if (
        transaction.status === TransactionStatus.CLEARED ||
        transaction.status === TransactionStatus.REFUND ||
        AccountStatement.isSctOperation(transaction)
      ) {
        segregatedOperations.push({
          createdAt: transaction.date,
          clearedAt: transaction.clearingDate,
          type: transaction.type,
          description: transaction.label,
          direction: transaction.direction,
          amount: transaction.amount,
          originalAmount: transaction.originalAmount || transaction.amount,
          currency: transaction.currency || Currency.EUR,
          transactionId: transaction.refId,
          counterParty: transaction.counterParty,
        });
      }
    }

    return segregatedOperations;
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  private static getDescription(operation: Operation) {
    if (AccountStatement.isSctInOperation(operation)) {
      return operation.counterParty ? `Vir. reçu de ${operation.counterParty.fullname}` : 'Vir. entrant';
    }
    if (AccountStatement.isSctOutOperation(operation)) {
      return operation.counterParty ? `Vir. à ${operation.counterParty.fullname}` : 'Vir. sortant';
    }
    if (AccountStatement.isAtmOperation(operation)) {
      return 'Retrait distributeur';
    }
    if (AccountStatement.isSplitOperation(operation)) {
      if (operation.credit.key === ScheduleKey.FUNDING) {
        return 'Fractionnement Oney 3x4x';
      }
      if (operation.credit.key === ScheduleKey.FEE) {
        return 'Frais de fractionnement';
      }
      if ([ScheduleKey.M1, ScheduleKey.M2, ScheduleKey.M3, ScheduleKey.M4].includes(operation.credit.key)) {
        return `Échéance ${operation.credit.monthPaid}/${operation.credit.monthTotal}: opération carte`;
      }
    }
    return operation.description;
  }

  private filterTransactionForBalance(transactions: any[], dateFrom: Date) {
    return transactions.filter(
      t =>
        t.clearingDate &&
        new Date(t.clearingDate).getTime() > dateFrom.getTime() &&
        ![TransactionStatus.EXPIRED, TransactionStatus.FAILED, TransactionStatus.CANCELLED].includes(
          t.status,
        ),
    );
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  private getBalance(_transactions: any[], dateFrom: Date, currentBalance: number) {
    let balance = currentBalance;
    const transactions = this.filterTransactionForBalance(_transactions, dateFrom);

    for (const transaction of transactions) {
      if (AccountStatement.isDebitOperation(transaction)) {
        balance += transaction.amount;
      } else {
        balance -= transaction.amount;
      }
    }

    return balance;
  }

  static isDebitOperation(operation: { direction: TransactionDirection | string }): boolean {
    return operation.direction === TransactionDirection.OUT;
  }

  private static isCreditOperation(operation: { direction: TransactionDirection | string }): boolean {
    return operation.direction === TransactionDirection.IN;
  }

  private static isSplitOperation(operation: Operation): boolean {
    return !!(operation.credit && operation.credit.contractNumber);
  }

  private static isCopOperation(operation: { type: TransactionType }): boolean {
    return operation.type === TransactionType.CARD;
  }

  static isSctOperation(operation: { type: TransactionType }): boolean {
    return operation.type === TransactionType.TRANSFER || operation.type === TransactionType.ORDER;
  }

  private static isSctOutOperation(operation: {
    type: TransactionType;
    direction: TransactionDirection | string;
  }): boolean {
    return AccountStatement.isSctOperation(operation) && operation.direction === TransactionDirection.OUT;
  }

  private static isSctInOperation(operation: {
    type: TransactionType;
    direction: TransactionDirection | string;
  }): boolean {
    return AccountStatement.isSctOperation(operation) && operation.direction === TransactionDirection.IN;
  }

  private static isAtmOperation(operation: { type: TransactionType }): boolean {
    return operation.type === TransactionType.ATM;
  }

  static getBalance(balance: number): DirectionAmount {
    return {
      direction: Math.sign(balance) === 1 ? TransactionDirection.IN : TransactionDirection.OUT,
      amount: new AmountPositive(balance).value,
    };
  }

  private static getAllCredits(allCreditsSignedAmount: number, operationsCount: number): DirectionAmount {
    return {
      direction: TransactionDirection.IN,
      amount: new AmountPositive(allCreditsSignedAmount).value,
      operationsCount: operationsCount || 0,
    };
  }

  private static getAllDebits(allDebitsSignedAmount: number, operationsCount: number): DirectionAmount {
    return {
      direction: TransactionDirection.OUT,
      amount: new AmountPositive(allDebitsSignedAmount).value,
      operationsCount: operationsCount || 0,
    };
  }

  private static getAllCop(allCopSignedAmount: number): DirectionAmount {
    return {
      direction: AccountStatement.getDirection(allCopSignedAmount),
      amount: new AmountPositive(allCopSignedAmount).value,
    };
  }

  private static getAllSctOut(allSctOutSignedAmount: number): DirectionAmount {
    return {
      direction: TransactionDirection.OUT,
      amount: new AmountPositive(allSctOutSignedAmount).value,
    };
  }

  private static getAllSctIn(allSctInSignedAmount: number): DirectionAmount {
    return {
      direction: TransactionDirection.IN,
      amount: new AmountPositive(allSctInSignedAmount).value,
    };
  }

  private static getAllAtm(allAtmSignedAmount: number): DirectionAmount {
    return {
      direction: AccountStatement.getDirection(allAtmSignedAmount),
      amount: new AmountPositive(allAtmSignedAmount).value,
    };
  }

  private static getSignedValue(value: DirectionAmount): number {
    return value.direction === TransactionDirection.IN ? +value.amount : -value.amount;
  }

  private static getDirection(signedValue: number): string {
    return Math.sign(signedValue) === 1 ? TransactionDirection.IN : TransactionDirection.OUT;
  }

  set state(state: AccountStatementState) {
    this.props.documentState = state;
  }

  set documentStateError(documentStateError: { fromBalance?: DirectionAmount; toBalance?: DirectionAmount }) {
    this.props.documentStateError = documentStateError;
  }
}
