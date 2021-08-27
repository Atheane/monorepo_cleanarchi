export class AlgoanAccountDto {
  balance: number;
  balanceDate: string;
  connectionSource: string;
  currency: string;
  type: string;
  usage: string;
  status?: string;
  banksUserId?: string;
  reference?: string;
  bank?: string;
  iban?: string;
  bic?: string;
  name?: string;
  savingsDetails?: string;
  loanDetails?: LoanDetailsDto;
  id?: string;
}

export class LoanDetailsDto {
  type?: string;
  amount?: number;
  startDate?: string;
  endDate?: string;
  payment?: number;
  remainingCapital?: number;
  interestRate?: number;
  debitedAccountId?: string;
}
