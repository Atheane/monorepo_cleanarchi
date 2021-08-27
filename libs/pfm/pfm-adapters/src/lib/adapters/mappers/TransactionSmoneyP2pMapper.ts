import { injectable } from 'inversify';
import {
  Transaction,
  BankAccount,
  NonCardTransaction,
  P2p,
  CounterParty,
  Direction,
  TransactionStatus,
  TransactionType,
} from '@oney/pfm-core';
import { Mapper, Currency } from '@oney/common-core';

@injectable()
export class TransactionSmoneyP2pMapper implements Mapper<Transaction> {
  toDomain({ smoneyBankAccounts, raw }: { smoneyBankAccounts: BankAccount[]; raw: P2p }): Transaction {
    const { props } = raw;
    const direction = smoneyBankAccounts.map(item => item.id).includes(props.beneficiary.id)
      ? Direction.IN
      : Direction.OUT;
    const { amount } = props;
    let counterParty: CounterParty = {
      id: null,
      iban: null,
      fullname: null,
    };

    if (direction === Direction.IN) {
      counterParty = props.sender;
    }
    if (direction === Direction.OUT) {
      counterParty = props.beneficiary;
    }

    const bankAccount = smoneyBankAccounts[0];
    const transaction = new Transaction({
      refId: props.orderId,
      bankAccountId: bankAccount.id,
      amount,
      originalAmount: amount,
      date: props.date,
      clearingDate: props.date,
      conversionRate: null,
      currency: Currency.EUR,
      direction,
      rejectionReason: null,
      status: TransactionStatus.CLEARED,
      type: TransactionType.P2P,
      label: props.message,
      fees: null,
      isDeposit: false,
      tag: props.tag.generatedTag,
    });
    return new NonCardTransaction(transaction, counterParty);
  }
}
