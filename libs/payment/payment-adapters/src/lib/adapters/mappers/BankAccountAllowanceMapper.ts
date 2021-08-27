import { Mapper } from '@oney/common-core';
import { AccountMonthlyAllowance } from '@oney/payment-core';
import { SmoneyAllowanceResponse } from '../partners/smoney/models/allowance/SmoneyAllowanceResponse';

export class BankAccountAllowanceMapper implements Mapper<AccountMonthlyAllowance, SmoneyAllowanceResponse> {
  toDomain(raw: SmoneyAllowanceResponse): AccountMonthlyAllowance {
    return {
      uid: raw.uid,
      monthlyAuthorizedAllowance: Math.ceil(raw.GlobalOut.MonthlyAllowance / 100),
      monthlyUsedAllowance: Math.ceil(raw.GlobalOut.MonthlyUsedAllowance / 100),
    };
  }
}
