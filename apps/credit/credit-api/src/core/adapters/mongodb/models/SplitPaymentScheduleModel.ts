import { ContractStatus, SplitProduct } from '@oney/credit-messages';
import { Document, Schema, Connection, Model } from 'mongoose';
import { SplitPaymentSchedule } from '@oney/credit-core';

export type SplitPaymentScheduleDoc = SplitPaymentSchedule & Document;

export class SplitPaymentScheduleSchema extends Schema {
  constructor() {
    super(
      {
        id: { type: String, required: true },
        contractNumber: { type: String, required: true, unique: true },
        bankAccountId: { type: String, required: true },
        userId: { type: String, required: true, index: true },
        label: { type: String, required: true },
        status: { type: String, required: true, enum: Object.values(ContractStatus) },
        productCode: { type: String, required: true, enum: Object.values(SplitProduct) },
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

const SplitPaymentScheduleIdentifier = 'SplitPaymentSchedule';
let SplitPaymentScheduleModel;
export const connectSplitPaymentScheduleModel = (connection: Connection): Model<SplitPaymentScheduleDoc> => {
  SplitPaymentScheduleModel = connection.model<SplitPaymentScheduleDoc>(
    SplitPaymentScheduleIdentifier,
    new SplitPaymentScheduleSchema(),
  );
  return SplitPaymentScheduleModel;
};

export const getSplitPaymentScheduleModel = (): Model<SplitPaymentScheduleDoc> => SplitPaymentScheduleModel;
