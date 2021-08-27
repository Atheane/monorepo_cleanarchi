import { Document, model, Schema } from 'mongoose';
import { RecipientDaoProperties } from '../RecipientDaoProperties';

export type RecipientDoc = RecipientDaoProperties & Document;
export const RECIPIENT_IDENTIFIER = 'Recipients';

const RecipientSchema = new Schema<RecipientDoc>(
  {
    uid: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    profile: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      birthCountry: { type: String, required: true },
      birthDate: { type: Date, required: true },
      phone: { type: String, required: true },
      address: {
        street: { type: String, required: true },
        additionalStreet: { type: String, required: false },
        city: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true },
      },
    },
    preferences: {
      allowAccountNotifications: {
        type: Boolean,
        default: true,
      },
      allowTransactionNotifications: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    versionKey: false,
  },
);

export const RecipientModel = model<RecipientDoc>(RECIPIENT_IDENTIFIER, RecipientSchema);
