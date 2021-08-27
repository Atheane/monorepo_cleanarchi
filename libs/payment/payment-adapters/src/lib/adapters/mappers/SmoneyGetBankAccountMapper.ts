import { Mapper } from '@oney/common-core';
import { BankAccount } from '@oney/payment-core';
import { SmoneyUserResponse } from '../partners/smoney/models/user/SmoneyUserResponse';

export class SmoneyGetBankAccountMapper implements Mapper<BankAccount, SmoneyUserResponse> {
  constructor(private readonly smoneyBic: string) {}

  toDomain(raw: SmoneyUserResponse): BankAccount {
    return new BankAccount({
      uid: raw.AppUserId,
      debts: [],
      bankAccountId: raw.Id.toString(),
      iban: raw.SubAccounts[0].Iban,
      bic: this.smoneyBic,
      cards: [],
      beneficiaries: [],
    });
  }
}
