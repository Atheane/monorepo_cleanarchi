import { injectable, inject } from 'inversify';
import { PfmIdentifiers, BankAccount, IAppConfiguration } from '@oney/pfm-core';
import { Mapper, Currency, TransactionSource } from '@oney/common-core';
import { SMoneyBankAccount } from '../models/bankAccount/BankAccount';

@injectable()
export class BankAccountSMoneyMapper implements Mapper<BankAccount[]> {
  constructor(
    @inject(PfmIdentifiers.configuration)
    private readonly config: IAppConfiguration,
  ) {}

  toDomain(raw: SMoneyBankAccount): BankAccount[] {
    return raw.SubAccounts.map(account => {
      const BANK_NAME = 'Oney Banque Digitale';
      const BANK_ONEY_LOGO_NAME = 'oney';
      const BLOB_STORAGE_LOGO_PATH = 'logo-bank';
      // SMoney amounts are express in cents
      const balance = account.Amount / 100;
      const logo = `${this.config.blobStorageEndpoint}/${BLOB_STORAGE_LOGO_PATH}/${BANK_ONEY_LOGO_NAME}.png`;
      return new BankAccount({
        id: raw.Id.toString(),
        name: account.DisplayName,
        number: null,
        currency: Currency.EUR,
        balance,
        metadatas: {
          iban: account.Iban,
          fullname: account.DisplayName,
        },
        bank: {
          logo,
          name: BANK_NAME,
          source: TransactionSource.ODB,
        },
      });
    });
  }
}
