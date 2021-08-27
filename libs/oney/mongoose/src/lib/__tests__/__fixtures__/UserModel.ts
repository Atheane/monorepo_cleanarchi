import { Connection, Document } from 'mongoose';
import { MongooseModelFactory } from '../../MongooseModelFactory';

export type UserDoc = { status: string; avatar: string } & Document;

export function generateUserModel(connection?: Connection) {
  const factory = new MongooseModelFactory(connection);

  return factory.create<UserDoc>('Users', {
    status: {
      type: String,
      required: true,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
    },
    avatar: {
      type: String,
    },
  });
}
