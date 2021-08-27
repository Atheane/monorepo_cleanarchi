import { CallbackType } from '../../types/CallbackType';

export interface COPCallbackPayloadProperties {
  id: string;
  reference: string;
  type: CallbackType;
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
}
