import { BankAccount, Bank, ShortName } from '@oney/aggregation-core';
import { Mapper } from '@oney/common-core';
import { injectable } from 'inversify';
import { BankMapper } from '../../bank/mappers';
import { IBankAccountProperties, IBankAccountPropertiesWithBank } from '../dto/IBankAccount';

@injectable()
export class BankAccountMapper implements Mapper<BankAccount> {
  constructor(private readonly bankMapper: BankMapper) {}
  fromDomain(bankAccount: BankAccount): IBankAccountProperties {
    const {
      id,
      balance,
      name,
      currency,
      aggregated,
      establishment,
      number,
      metadatas,
      usage,
      type,
    } = bankAccount.props;
    return {
      id,
      name,
      number,
      currency,
      balance,
      establishment,
      metadatas,
      aggregated,
      usage,
      type,
    };
  }
  fromDomainWithBank({
    bankAccount,
    bank,
  }: {
    bankAccount: BankAccount;
    bank: Bank;
  }): IBankAccountPropertiesWithBank {
    const { id, balance, name, currency, aggregated, establishment, number, metadatas } = bankAccount.props;
    const shortName = new ShortName(name);
    return {
      id,
      balance,
      name: shortName.value,
      currency,
      aggregated,
      establishment,
      number,
      metadatas,
      bank: this.bankMapper.fromDomain(bank),
    };
  }
}
