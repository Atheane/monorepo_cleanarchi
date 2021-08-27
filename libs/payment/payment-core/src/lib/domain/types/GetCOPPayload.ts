export type GetCOPPayload = {
  tid?: string;
  reference: string;
  cardAcceptorIdentificationCodeName: string;
  transactionAmount: string;
  cardHolderBillingAmount?: string;
  cardHolderBillingConversionRate?: string;
  availableBalance: string;
  currencyCodeTransaction: string;
  merchantType: string;
  status: string;
};
