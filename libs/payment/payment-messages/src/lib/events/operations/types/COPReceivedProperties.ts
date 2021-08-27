export type COPReceivedProperties = {
  id: string;
  reference: string;
  type: string;
  transactionAmount: string;
  currencyCodeTransaction: string;
  cardHolderBillingAmount?: string;
  cardHolderBillingConversionRate?: string;
  availableBalance: string;
  actionCode?: string;
  merchantType: string;
  cardAcceptorIdentificationCodeName: string;
  status: string;
  userId: string;
};
