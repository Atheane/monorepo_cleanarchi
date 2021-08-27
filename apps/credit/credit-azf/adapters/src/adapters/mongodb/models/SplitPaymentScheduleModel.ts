import { Document, Schema, model } from 'mongoose';
import { SplitPaymentSchedule } from '../../../../../core/src/domain/entities';
import { ContractStatus, SplitProduct } from '../../../../../core/src/domain/types';

export type SplitPaymentScheduleDoc = SplitPaymentSchedule & Document;

export class SplitPaymentScheduleSchema extends Schema {
  constructor() {
    super(
      {
        id: { type: String, required: true, unique: true },
        contractNumber: { type: String, required: true, unique: true },
        bankAccountId: { type: String, required: true },
        userId: { type: String, required: true },
        productCode: { type: String, required: true, enum: Object.values(SplitProduct) },
        status: { type: String, required: true, enum: Object.values(ContractStatus) },
        fundingExecution: { type: Object, required: false },
        paymentsExecution: { type: Object, required: false },
        createdAt: { type: Date, required: false, default: Date.now },
        updatedAt: { type: Date, required: false, default: Date.now },
        initialTransactionId: { type: String, required: false },
      },
      {
        versionKey: false,
      },
    );
  }
}

const PaymentScheduleIdentifier = 'SplitPaymentSchedule';

export const SplitPaymentScheduleModel = model<SplitPaymentScheduleDoc>(
  PaymentScheduleIdentifier,
  new SplitPaymentScheduleSchema(),
);
