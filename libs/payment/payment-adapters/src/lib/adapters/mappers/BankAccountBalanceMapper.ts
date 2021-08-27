import { Mapper } from '@oney/common-core';
import { AccountBalance } from '@oney/payment-core';
import { SmoneyUserResponse } from '../partners/smoney/models/user/SmoneyUserResponse';

export class BankAccountBalanceMapper implements Mapper<AccountBalance, SmoneyUserResponse> {
  toDomain(raw: SmoneyUserResponse): AccountBalance {
    const { AppUserId, Amount } = raw;

    return {
      uid: AppUserId,
      balance: Amount,
    };
  }
}
