interface GlobalLimits {
  AnnualAllowance: number;
  MonthlyAllowance: number;
  WeeklyAllowance: number;
}

export interface SmoneyUpdateLimitInformationRequest {
  GlobalIn: GlobalLimits;
  GlobalOut: GlobalLimits;
  BalanceLimit: number;
}

export interface SmoneyUpdateLimitGlobalOut {
  GlobalOut: GlobalLimits;
}
