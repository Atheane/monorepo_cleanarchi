type Reference = string;

export interface Payment {
  type: string;
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
