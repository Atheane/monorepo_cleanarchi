import { Document, Schema } from 'mongoose';
import { BillProperties } from '@oney/subscription-core';

export type BillDoc = BillProperties & Document;
// We ignore this because we test this implem on the subscription-azf.
/* istanbul ignore next */
export class BillModel extends Schema<BillDoc> {
  constructor() {
    super({
      uid: {
        type: String,
        index: true,
        required: true,
      },
      subscriptionId: {
        type: String,
        index: true,
        required: true,
      },
      offerId: {
        type: String,
        index: true,
        required: true,
      },
      orderId: {
        type: String,
        index: true,
        unique: true,
        required: true,
      },
      payedAt: {
        type: Date,
        default: null,
        index: true,
        required: false,
      },
      billedAt: {
        type: Date,
        index: true,
        default: new Date(),
      },
      period: {
        type: Number,
        index: true,
      },
      amount: {
        type: Number,
        required: true,
        default: null,
      },
      ref: { type: Number, required: true },
      createdAt: { type: Date, default: new Date() },
      updatedAt: { type: Date, required: false },
    });
  }
}
