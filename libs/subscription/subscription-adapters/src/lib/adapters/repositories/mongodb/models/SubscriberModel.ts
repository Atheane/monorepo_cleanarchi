import { Document, Schema } from 'mongoose';
import { SubscriberProperties } from '@oney/subscription-core';

export type SubscriberDoc = SubscriberProperties & Document;
// We ignore this because we test this implem on the subscription-azf.
/* istanbul ignore next */
export class SubscriberModel extends Schema<SubscriberDoc> {
  constructor() {
    super({
      uid: {
        type: String,
        index: true,
        required: true,
        unique: true,
      },
      customerType: {
        type: String,
        index: true,
        required: true,
      },
      activatedAt: {
        type: Date,
        index: true,
        required: false,
        default: null,
      },
      createdAt: { type: Date, default: new Date() },
      updatedAt: { type: Date, required: false },
    });
  }
}
