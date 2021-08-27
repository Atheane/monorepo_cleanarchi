import { Mapper } from '@oney/common-core';
import { LimitInformation } from '@oney/payment-core';
import { SmoneyUpdateLimitInformationRequest } from '../partners/smoney/models/bankAccount/LimitInformationRequest';

export class LimitInformationMapper implements Mapper<LimitInformation> {
  fromDomain(limits: LimitInformation): SmoneyUpdateLimitInformationRequest {
    return {
      GlobalIn: {
        AnnualAllowance: limits.props.globalIn.annualAllowance * 100,
        MonthlyAllowance: limits.props.globalIn.monthlyAllowance * 100,
        WeeklyAllowance: limits.props.globalIn.weeklyAllowance * 100,
      },
      GlobalOut: {
        AnnualAllowance: limits.props.globalOut.annualAllowance * 100,
        MonthlyAllowance: limits.props.globalOut.monthlyAllowance * 100,
        WeeklyAllowance: limits.props.globalOut.weeklyAllowance * 100,
      },
      BalanceLimit: limits.props.balanceLimit * 100,
    };
  }
}
