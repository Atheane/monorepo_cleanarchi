import { StrongAuthVerifier } from '@oney/authentication-core';
import { Document, Schema, model } from 'mongoose';

export type StrongAuthVerifierDoc = StrongAuthVerifier & Document;

const StrongAuthVerifierSchema = new Schema<StrongAuthVerifierDoc>(
  {
    verifierId: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    status: { type: String, required: true, index: true },
    valid: { type: Boolean, required: true, index: true },
    factor: { type: String, required: true, index: true },
    channel: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    createdAt: { type: Date, required: true, default: new Date() },
    updatedAt: { type: Date, required: true, default: new Date() },
    credential: { type: String, required: false, default: null },
    customer: { type: Object, required: true, default: null },
    action: { type: Object, required: true, default: null },
    metadatas: { type: Object, required: true, default: null },
    consumedAt: { type: Date, required: false, default: null },
  },
  {
    versionKey: false,
  },
);

const StrongAuthId = 'ScaVerifiers';

export const StrongAuthVerifierModel = model<StrongAuthVerifierDoc>(StrongAuthId, StrongAuthVerifierSchema);
