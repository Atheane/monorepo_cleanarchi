import { InitialPaymentSchedule } from '@oney/credit-messages';
import { Document, Schema, model } from 'mongoose';
import { ContractStatus, PaymentStatus, SplitProduct } from '../../../../../core/src/domain/types';

export interface PaymentExecutionModel {
  key: string;
  amount: number;
  dueDate: Date;
  status: PaymentStatus;
  paymentDate?: Date;
  transactionId?: string;
}

export interface SplitPaymentScheduleModel {
  id: string;

  contractNumber: string;

  bankAccountId: string;

  userId: string;

  productCode: SplitProduct;

  status: ContractStatus;

  fundingExecution: PaymentExecutionModel;

  paymentsExecution: PaymentExecutionModel[];
}

export interface SplitContractModel {
  contractNumber: string;
  bankAccountId: string;
  userId: string;
  initialTransactionId: string;
  apr: number;
  productCode: SplitProduct;
  subscriptionDate: Date;
  status: ContractStatus;
  initialPaymentSchedule: InitialPaymentSchedule;
  finalPaymentSchedule?: SplitPaymentScheduleModel;
}

export type SplitContractDoc = SplitContractModel & Document;

export class SplitContractSchema extends Schema {
  constructor() {
    super(
      {
        contractNumber: { type: String, required: true },
        bankAccountId: { type: String, required: true },
        userId: { type: String, required: true },
        initialTransactionId: { type: String, required: true },
        apr: { type: Number, required: true },
        productCode: { type: String, required: true, enum: Object.values(SplitProduct) },
        subscriptionDate: { type: Date, required: true },
        status: { type: String, required: true, enum: Object.values(ContractStatus) },
        initialPaymentSchedule: { type: Object, required: true },
        finalPaymentSchedule: { type: Object, required: false },
        createdAt: { type: Date, required: false, default: Date.now },
        updatedAt: { type: Date, required: false, default: Date.now },
      },
      {
        versionKey: false,
      },
    );
  }
}

const SplitContractIdentifier = 'SplitContract';

export const SplitContractModel = model<SplitContractDoc>(SplitContractIdentifier, new SplitContractSchema());
