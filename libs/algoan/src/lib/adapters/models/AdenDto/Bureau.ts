type Reference = string;

interface Payment {
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
  payments: Payment[];
}
