import { BankAccountType, BankAccountUsage } from '@oney/aggregation-core';
import { Currency } from '@oney/common-core';

export const bankAccountProps = {
  id: '17139',
  aggregatedAccountRefId: '17139',
  balance: 9856.51,
  name: 'my account',
  currency: Currency.EUR,
  aggregated: true,
  establishment: { name: null },
  number: '3002900000',
  metadatas: { iban: 'EX6713335395899300290000026' },
  type: BankAccountType.CHECKING,
  usage: BankAccountUsage.PRIV,
  ownership: 'owner',
  connectionId: '7d050139-5a39-4a7c-ab1b-64035f2ea88d',
  bankId: '338178e6-3d01-564f-9a7b-52ca442459bf',
  isOwnerBankAccount: false,
};
