import { Document, Schema, Connection, Model } from 'mongoose';
import { UserProperties } from '../../../core/domain/entities/User';

export type UserDoc = UserProperties & Document;

export class UserSchema extends Schema {
  constructor() {
    super(
      {
        uid: {
          type: String,
          required: true,
          index: true,
          unique: true,
        },
        createdAt: { type: Date, required: false, default: Date.now },
        updatedAt: { type: Date, required: false, default: Date.now },
        email: {
          type: String,
          required: true,
          index: true,
          unique: true,
        },
        phone: { type: Boolean, required: false, default: false },
        pinCode: { type: Object, required: false, default: null },
        metadata: { type: Object, required: false, default: null },
        provisioning: { type: Object, required: false, default: null },
      },
      {
        versionKey: false,
      },
    );
  }
}

const UserIdentifier = 'Users';

export const getUserModel = (connection: Connection): Model<UserDoc> =>
  connection.model<UserDoc>(UserIdentifier, new UserSchema());
