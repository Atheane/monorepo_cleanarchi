export type OdbPaymentCommand = {
  ref: number;
  amount: number;
  message: string;
  senderId?: string;
  beneficiaryId?: string;
  contractNumber: string;
};
