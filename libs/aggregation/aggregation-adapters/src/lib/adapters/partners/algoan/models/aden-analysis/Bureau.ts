type Reference = string;

export interface AlgoanPayment {
  algoanType: string;
  nbOfTransactions: number;
  references: Reference[];
  totalAmount: number;
}
export interface Bureau {
  events: {};
  gambling: {};
  incidents: {};
  overdraft: {};
  credit: {};
  frequentTransactions: [];
  payments: AlgoanPayment[];
}
