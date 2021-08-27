import { Document, Schema } from 'mongoose';
import { SubscriptionProperties } from '@oney/subscription-core';
import { SubscriptionStatus } from '@oney/subscription-messages';

export type SubscriptionDoc = SubscriptionProperties & Document;
// We ignore this because we test this implem on the subscription-azf.
/* istanbul ignore next */
export class SubscriptionModel extends Schema<SubscriptionDoc> {
  constructor() {
    super({
      id: {
        type: String,
        index: true,
        required: true,
        unique: true,
      },
      subscriberId: {
        type: String,
        index: true,
        required: true,
      },
      offerId: {
        type: String,
        index: true,
        required: true,
      },
      activationDate: {
        type: Date,
        index: true,
        required: false,
        default: null,
      },
      nextBillingDate: {
        type: Date,
        index: true,
        required: false,
        default: null,
      },
      cardId: {
        type: String,
        index: true,
        required: false,
        default: null,
      },
      createdAt: { type: Date, default: new Date() },
      updatedAt: { type: Date, required: false },
      endDate: { type: Date, required: false, default: null },
      status: {
        type: String,
        enum: Object.values(SubscriptionStatus),
        default: SubscriptionStatus.PENDING_ACTIVATION,
      },
      insuranceMembershipId: { type: String, index: true, required: false, default: null },
    });
  }
}
