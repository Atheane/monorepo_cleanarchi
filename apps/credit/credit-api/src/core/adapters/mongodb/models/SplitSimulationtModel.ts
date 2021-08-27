import { SplitProduct } from '@oney/credit-messages';
import { Document, Schema, Connection, Model } from 'mongoose';
import { SplitSimulation } from '@oney/credit-core';

export type SplitSimulationDoc = SplitSimulation & Document;

export class SplitSimulationSchema extends Schema {
  constructor() {
    super(
      {
        id: { type: String, required: true },
        userId: { type: String, required: true },
        label: { type: String, required: true },
        initialTransactionId: { type: String, required: true, index: true },
        transactionDate: { type: Date, required: false, default: Date.now },
        productCode: { type: String, required: true, enum: Object.values(SplitProduct) },
        fundingAmount: { type: Number, required: true },
        fee: { type: Number, required: true },
        apr: { type: Number, required: true },
        immediatePayments: { type: Object, required: true },
        deferredPayments: { type: Object, required: true },
        createdAt: { type: Date, required: false, default: Date.now },
        updatedAt: { type: Date, required: false, default: Date.now },
      },
      {
        versionKey: false,
      },
    );
  }
}

const SplitSimulationIdentifier = 'SplitSimulation';
let SplitSimulationModel;
export const connectSplitSimulationModel = (connection: Connection): Model<SplitSimulationDoc> => {
  SplitSimulationModel = connection.model<SplitSimulationDoc>(
    SplitSimulationIdentifier,
    new SplitSimulationSchema(),
  );
  return SplitSimulationModel;
};

export const getSplitSimulationModel = (): Model<SplitSimulationDoc> => SplitSimulationModel;
