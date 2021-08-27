export interface GatewayMonthlyAllowance {
  monthlyUsedAllowance: number;
  /**
   * @deprecated remainingFundToSpend
   */
  remainingFundToSpend: number;
  authorizedAllowance: number;
}
