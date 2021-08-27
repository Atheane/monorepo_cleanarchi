import { injectable } from 'inversify';
import { BankAccount } from '@oney/pfm-core';
import { Mapper, TransactionSource } from '@oney/common-core';
import { AggregationAccount } from '../models/bankAccount/BankAccount';

@injectable()
export class BankAccountAggregationMapper implements Mapper<BankAccount> {
  toDomain(raw: AggregationAccount): BankAccount {
    const { id, name, number, currency, balance, metadatas, bank } = raw;
    let bankToDomain = {
      logo: null,
      name: null,
      source: TransactionSource.AGGREGATED,
    };
    if (raw.bank) {
      bankToDomain = {
        logo: bank.logo,
        name: bank.name,
        source: TransactionSource.AGGREGATED,
      };
    }
    return new BankAccount({
      id,
      name,
      number,
      currency,
      balance,
      metadatas,
      bank: bankToDomain,
    });
  }
}
