export interface MonthlyAllowance {
  /**
   * @deprecated remainingFundToSpend
   */
  remainingFundToSpend: number;
  authorizedAllowance: number;
  spentFunds?: number;
}
