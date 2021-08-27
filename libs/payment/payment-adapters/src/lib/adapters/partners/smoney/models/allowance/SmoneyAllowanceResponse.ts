interface SmoneyGlobalAllowance {
  AnnualAllowance: number;
  UsedAllowance: number;
  RenewalDate: Date;
  MonthlyAllowance: number;
  MonthlyUsedAllowance: number;
  MonthlyRenewalDate: Date;
  WeeklyAllowance: number;
  WeeklyUsedAllowance: number;
  WeeklyRenewalDate: Date;
}

export interface SmoneyAllowanceResponse {
  GlobalIn: SmoneyGlobalAllowance;
  GlobalOut: SmoneyGlobalAllowance;
  BalanceLimit: number;
  uid?: string;
}
