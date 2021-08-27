import { UserProperties, UserProvider } from '@oney/aggregation-core';
import { Document, Schema, model } from 'mongoose';

export type UserDoc = UserProperties & Document;

export class UserSchema extends Schema {
  constructor() {
    super(
      {
        userId: {
          type: String,
          required: true,
          index: true,
          unique: true,
        },
        consent: { type: Boolean, required: false },
        consentDate: { type: Date, required: false, default: Date.now },
        credential: { type: String, required: false },
        creditDecisioningUserId: { type: String, required: false },
        provider: { type: String, required: false, enum: Object.values(UserProvider) },
        createdAt: { type: Date, required: false, default: Date.now },
        updatedAt: { type: Date, required: false, default: Date.now },
      },
      {
        versionKey: false,
      },
    );
  }
}

const UserIdentifier = 'BanksAccountsOwner'; //do not change identifier
// or prepare a migration script

export const UserModel = model<UserDoc>(UserIdentifier, new UserSchema());
