export type GetSingleClearingPayload = {
  tid?: string;
  reference: string;
  originalAmount: number;
  amount: number;
  financialNetworkCode: number;
  exchangeRate: number;
  currency: string;
  status: number;
  type: number;
  cardId: string;
  merchant: {
    street: string;
    city: string;
    categoryCode: number;
    name: string;
  };
};
