export interface CustomerSituationsResponse {
  customer_flag: string;
  internal_incidents?: {
    worse_unpaid_stage?: string;
    worse_household_functioning_status_code?: string;
    last_worse_household_functioning_status_code_update_date?: string;
    store_credit_limit_blocked_flag?: string;
    store_credit_limit_blocked_reason?: string;
    vplus_credit_limit_blocked_flag?: string;
    vplus_credit_limit_blocked_reason?: string;
    reconfiguration_flag?: string;
    indebtedness_flag?: string;
    ended_amicable_collecting_date?: string;
  };
  credit_accounts_situation?: {
    total_outstanding_amount: string;
  };
}
