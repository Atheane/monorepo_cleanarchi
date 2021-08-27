interface CalendarEvents {
  amout: number;
  month: string;
}

enum CashFlowType {
  REGULAR_INCOME = 'REGULAR_INCOME',
  REGULAR_EXPENSE = 'REGULAR_EXPENSE',
  FAMILY_ALLOWANCE = 'FAMILY_ALLOWANCE',
  UNEMPLOYMENT_ALLOWANCE = 'UNEMPLOYMENT_ALLOWANCE',
  HEALTH_ALLOWANCE = 'HEALTH_ALLOWANCE',
  INSURANCE_REFUND = 'INSURANCE_REFUND',
  LOC_DRAWDOWN = 'LOC_DRAWDOWN',
  CHECK_REJECTION = 'CHECK_REJECTION',
  PAYMENT_REJECTION = 'PAYMENT_REJECTION',
  PERSO_TAX_PAYBACK = 'PERSO_TAX_PAYBACK',
  PRO_TAX_PAYBACK = 'PRO_TAX_PAYBACK',
  GAMBLING_GAIN = 'GAMBLING_GAIN',
  RENTAL_INCOME = 'RENTAL_INCOME',
  WAGE = 'WAGE',
  RETIREMENT_PENSION = 'RETIREMENT_PENSION',
  LOAN = 'LOAN',
  GAMBLING = 'GAMBLING',
  PERSO_TAX = 'PERSO_TAX',
  PRO_TAX = 'PRO_TAX',
  RENT = 'RENT',
  ATM = 'ATM',
  CHECK = 'CHECK',
  ATM_DEPOSIT = 'ATM_DEPOSIT',
  CHECK_DEPOSIT = 'CHECK_DEPOSIT',
  CARD_PAYMENT = 'CARD_PAYMENT',
  CARD_REFUND = 'CARD_REFUND',
  SPLIT_PAYMENT = 'SPLIT_PAYMENT',
  POWER_TELECOM = 'POWER_TELECOM',
  DIFFERED_PAYMENT = 'DIFFERED_PAYMENT',
  INSURANCE = 'INSURANCE',
  BANK_SERVICE_FEES = 'BANK_SERVICE_FEES',
  BANK_INCIDENT_FEES = 'BANK_INCIDENT_FEES',
  OVERDRAFT_FEES = 'OVERDRAFT_FEES',
  OTHER_INCOME = 'OTHER_INCOME',
  OTHER_EXPENSE = 'OTHER_EXPENSE',
  INTERNAL_TRANSFER = 'INTERNAL_TRANSFER',
}

interface CashFlow {
  type: CashFlowType;
  label: string | null;
  monthlyAmount: number;
  totalAmount: number;
  meanAmount: number;
  nbTransactions: number;
  dueDay: number;
  calendar: CalendarEvents[];
  references: Reference[];
}

type Reference = string | null;

interface BudgetIndicators {
  debtToIncome: number;
  residualIncome: number;
  allowancesRatio: number;
}
export interface Budget {
  cashflows: CashFlow[];
  indicators: BudgetIndicators;
}
