import { ContractStatus } from '@oney/credit-messages';
import { InitialPaymentSchedule } from '../../../../types/InitialPaymentSchedule';
import { SplitProduct } from '../../../../types/SplitProduct';

export type SplitContractCreatedProperties = {
  contractNumber: string;
  userId: string;
  initialTransactionId: string;
  apr: number;
  productCode: SplitProduct;
  subscriptionDate: Date;
  status: ContractStatus;
  bankAccountId: string;
  initialPaymentSchedule: InitialPaymentSchedule;
  label: string;
  termsVersion: string;
};
