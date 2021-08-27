import { Document, Schema, Connection, Model } from 'mongoose';
import { User } from '@oney/pfm-core';

export type UserDoc = User & Document;

export class UserSchema extends Schema {
  constructor() {
    super(
      {
        uid: { type: String, unique: true, index: true },
        is_validated: { type: Boolean, default: false, required: true },
      },
      {
        versionKey: false,
      },
    );
  }
}

const UserIdentifier = 'User';

let UserModel: Model<UserDoc>;
export const connectUserModel = (connection: Connection): Model<UserDoc> => {
  UserModel = connection.model<UserDoc>(UserIdentifier, new UserSchema());
  return UserModel;
};

export const getUserModel = (): Model<UserDoc> => UserModel;
