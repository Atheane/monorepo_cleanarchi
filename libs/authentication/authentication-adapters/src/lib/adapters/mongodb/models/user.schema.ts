import { UserProperties } from '@oney/authentication-core';
import { Document, Schema, model } from 'mongoose';

export type UserDto = Omit<UserProperties, 'email'> & {
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type UserDoc = UserDto & Document;

const UserSchema = new Schema<UserDoc>(
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
    phone: { type: String, required: false, default: null },
    pinCode: { type: Object, required: false, default: null },
    metadata: { type: Object, required: false, default: null },
    provisioning: { type: Object, required: false, default: null },
    password: { type: String, required: false, default: null },
    hashedCardPans: { type: Array, required: false, default: null },
    blockedAt: { type: Date, required: false, default: null },
  },
  {
    versionKey: false,
  },
);

const UserId = 'Users';

export const UserModel = model<UserDoc>(UserId, UserSchema);
