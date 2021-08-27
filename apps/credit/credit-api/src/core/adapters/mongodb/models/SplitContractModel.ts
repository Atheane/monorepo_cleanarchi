import { ContractStatus, SplitProduct } from '@oney/credit-messages';
import { Document, Schema, Connection, Model } from 'mongoose';
import { SplitContract } from '@oney/credit-core';

export type SplitContractDoc = SplitContract & Document;

export class SplitContractSchema extends Schema {
  constructor() {
    super(
      {
        contractNumber: { type: String, required: true, unique: true },
        userId: { type: String, required: true, index: true },
        label: { type: String, required: true },
        termsVersion: { type: String, required: true },
        bankAccountId: { type: String, required: true, index: true },
        initialTransactionId: { type: String, required: true, unique: true },
        transactionDate: { type: Date, required: false, default: Date.now },
        apr: { type: Number, required: true },
        productCode: { type: String, required: true, enum: Object.values(SplitProduct) },
        subscriptionDate: { type: Date, required: true },
        status: { type: String, required: true, enum: Object.values(ContractStatus) },
        initialPaymentSchedule: { type: Object, required: false },
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
let SplitContractModel;
export const connectSplitContractModel = (connection: Connection): Model<SplitContractDoc> => {
  SplitContractModel = connection.model<SplitContractDoc>(SplitContractIdentifier, new SplitContractSchema());
  return SplitContractModel;
};

export const getSplitContractModel = (): Model<SplitContractDoc> => SplitContractModel;
