/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Loan {
  id: number;
  id_account: number;
  contact_name?: any;
  total_amount: number;
  available_amount?: any;
  used_amount?: any;
  subscription_date?: any;
  maturity_date?: any;
  next_payment_amount: number;
  next_payment_date?: any;
  rate?: any;
  nb_payments_left?: any;
  nb_payments_done?: any;
  nb_payments_total?: any;
  last_payment_amount?: any;
  last_payment_date?: any;
  account_label?: any;
  insurance_label?: any;
  duration?: any;
  type: string;
}
