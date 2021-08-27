import { TransactionType as AlgoanTransactionType } from '@oney/algoan';
import { Mapper, TransactionType } from '@oney/common-core';
import { injectable } from 'inversify';

@injectable()
export class AlgoanTransactionTypeMapper implements Mapper<TransactionType> {
  toDomain(raw: string): TransactionType {
    let type: TransactionType;
    switch (raw) {
      case AlgoanTransactionType.DIRECT_DEBIT:
        type = TransactionType.LOAN;
        break;
      case AlgoanTransactionType.CREDIT_CARD_PAYMENT:
        type = TransactionType.CARD;
        break;
      case AlgoanTransactionType.BANK_FEE:
        type = TransactionType.FEES;
        break;
      case AlgoanTransactionType.CHECK:
        type = TransactionType.CHECK;
        break;
      case AlgoanTransactionType.INTERNAL_TRANSFERT:
        type = TransactionType.ORDER;
        break;
      case AlgoanTransactionType.DEBIT:
        type = TransactionType.PAYBACK;
        break;
      case AlgoanTransactionType.POTENTIAL_TRANSFER:
        type = TransactionType.TRANSFER;
        break;
      case AlgoanTransactionType.ATM:
        type = TransactionType.ATM;
        break;
      default:
        break;
    }

    return type;
  }

  fromDomain(type: TransactionType): AlgoanTransactionType {
    let algoanType: AlgoanTransactionType;
    switch (type) {
      case TransactionType.LOAN:
        algoanType = AlgoanTransactionType.DIRECT_DEBIT;
        break;
      case TransactionType.CARD:
        algoanType = AlgoanTransactionType.CREDIT_CARD_PAYMENT;
        break;
      case TransactionType.FEES:
        algoanType = AlgoanTransactionType.BANK_FEE;
        break;
      case TransactionType.CHECK:
        algoanType = AlgoanTransactionType.CHECK;
        break;
      case TransactionType.ORDER:
        algoanType = AlgoanTransactionType.INTERNAL_TRANSFERT;
        break;
      case TransactionType.PAYBACK:
        algoanType = AlgoanTransactionType.DEBIT;
        break;
      case TransactionType.TRANSFER:
        algoanType = AlgoanTransactionType.POTENTIAL_TRANSFER;
        break;
      case TransactionType.ATM:
        algoanType = AlgoanTransactionType.ATM;
        break;
      default:
        break;
    }
    return algoanType;
  }
}
