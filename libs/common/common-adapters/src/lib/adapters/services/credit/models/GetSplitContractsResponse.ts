export enum SplitProduct {
  DF004 = 'DF004',
  DF003 = 'DF003',
}

export enum PaymentStatus {
  TODO = 'TODO',
  PAID = 'PAID',
  CANCELED = 'CANCELED',
}

export enum ContractStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  CANCELED = 'CANCELED',
  CANCELED_PRE_CLEARING = 'CANCELED_PRE_CLEARING',
  PAID = 'PAID',
  PAID_ANTICIPATED = 'PAID_ANTICIPATED',
}

export type PaymentExecution = {
  key: string;
  amount: number;
  dueDate: Date;
  status: PaymentStatus;
  paymentDate?: Date; // when payment really takes place
  transactionId?: string; // corresponds to orderId from odb_payment
};

export interface GetSplitContractsResponse {
  productCode: string;
  initialTransactionId: string;
  transactionDate: Date;
  subscriptionDate: Date;
  status: ContractStatus;
  contractNumber: string;
  apr: number;
  termsVersion: string;
  paymentScheduleExecution: PaymentExecution[];
}
