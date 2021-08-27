import { injectable } from 'inversify';
import { BankAccount } from '@oney/pfm-core';
import { Mapper } from '@oney/common-core';

type BankAccountResponse = {
  balance: number;
};

@injectable()
export class BankAccountMapper implements Mapper<BankAccount, BankAccountResponse> {
  fromDomain(bankAccount: BankAccount): BankAccountResponse {
    const { balance } = bankAccount;
    return {
      ...bankAccount,
      balance: balance.value,
    };
  }
}
