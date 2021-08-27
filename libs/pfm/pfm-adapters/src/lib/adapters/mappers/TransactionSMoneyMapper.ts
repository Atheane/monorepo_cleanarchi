import { getEnumKeyByEnumValue, Mapper, Currency } from '@oney/common-core';
import { injectable } from 'inversify';
import { get } from 'lodash';
import {
  CardTransaction,
  Transaction,
  BankAccount,
  NonCardTransaction,
  Card,
  CounterParty,
  Direction,
  Merchant,
  MerchantAddress,
  TransactionStatus,
  TransactionType,
} from '@oney/pfm-core';
import { SMoneyTransaction, SMoneyTransactionType } from '../models/transaction/SMoney';
import { SMoneyQuasiCashReference } from '../models/transaction/SMoneyQuasiCashReference';

@injectable()
export class TransactionSMoneyMapper implements Mapper<Transaction> {
  toDomain({ accounts, raw }: { accounts: BankAccount[]; raw: SMoneyTransaction }): Transaction {
    let type: TransactionType;
    switch (raw.type) {
      case getEnumKeyByEnumValue(SMoneyTransactionType, SMoneyTransactionType.SCT):
        type = TransactionType.TRANSFER;
        break;
      case getEnumKeyByEnumValue(SMoneyTransactionType, SMoneyTransactionType.SDD):
        type = TransactionType.ORDER;
        break;
      case getEnumKeyByEnumValue(SMoneyTransactionType, SMoneyTransactionType.ATM):
        type = TransactionType.ATM;
        break;
      case getEnumKeyByEnumValue(SMoneyTransactionType, SMoneyTransactionType.COP):
        type = TransactionType.CARD;
        break;
    }

    if (SMoneyQuasiCashReference.includes(raw.mcc)) {
      type = TransactionType.CARD;
    }

    const amount = raw.amount / 100;

    const address: MerchantAddress = {
      street: raw.merchantAddress,
      city: null,
      zipcode: null,
      country: null,
    };

    const merchant: Merchant = {
      mcc: String(raw.mcc),
      address,
    };

    const account = accounts[0];
    const direction = Direction[raw.direction.toUpperCase()];
    const counterParty = direction === Direction.IN ? raw.issuer : raw.beneficiary;
    const transaction = new Transaction({
      refId: raw.tid,
      bankAccountId: account.id,
      amount,
      originalAmount: raw.localAmount || raw.localAmount === 0 ? raw.localAmount / 100 : null,
      date: new Date(raw.date),
      conversionRate: raw.conversionRate || raw.conversionRate === 0 ? raw.conversionRate : null,
      clearingDate: raw.clearingDate ? new Date(raw.clearingDate) : null,
      currency: Currency[raw.currency] || raw.currency,
      direction,
      rejectionReason: raw.rejection_reason ?? null,
      status: TransactionStatus[raw.status.toUpperCase()],
      type,
      label: raw.type === 'SCT' || raw.type === 'SDD' ? raw.reason : raw.merchantName,
      fees: null,
      isDeposit: raw.is_deposit,
    });
    const card: Pick<Card, 'cardId' | 'pan' | 'merchant'> = {
      cardId: raw.cardId,
      pan: null,
      merchant,
    };
    const counterPartyFilter: Pick<CounterParty, 'id' | 'iban' | 'fullname'> = {
      id: get(counterParty, 'bid'),
      iban: get(counterParty, 'iban'),
      fullname: get(counterParty, 'name'),
    };
    return transaction.type === TransactionType.CARD
      ? new CardTransaction(transaction, card)
      : new NonCardTransaction(transaction, counterParty ? counterPartyFilter : null);
  }
}
