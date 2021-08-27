import { Invitation, InvitationState } from '@oney/authentication-core';
import { Document, Schema, model } from 'mongoose';

export type InvitationDoc = Invitation & Document;

const InvitationSchema = new Schema<InvitationDoc>(
  {
    uid: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    email: { type: String, required: true },
    createdAt: { type: Date, required: false, default: Date.now },
    updatedAt: { type: Date, required: false, default: Date.now },
    state: {
      type: String,
      required: false,
      default: InvitationState.PENDING,
      index: true,
    },
    phone: {
      type: String,
      required: false,
      index: true,
    },
    channel: {
      type: String,
      required: false,
      index: true,
    },
  },
  {
    versionKey: false,
  },
);

const InvitationId = 'Invitations';

export const InvitationModel = model<InvitationDoc>(InvitationId, InvitationSchema);
