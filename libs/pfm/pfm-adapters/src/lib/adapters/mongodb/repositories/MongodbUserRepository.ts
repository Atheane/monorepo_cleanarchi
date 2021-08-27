import { injectable } from 'inversify';
import { Model } from 'mongoose';
import { UserRepository, User } from '@oney/pfm-core';
import { UserMapper } from '../../mappers/UserMapper';
import { UserDoc } from '../models/User';

@injectable()
export class MongodbUserRepository implements UserRepository {
  constructor(private model: Model<UserDoc>, private userMapper: UserMapper) {}

  async getAllVerifiedUser(): Promise<User[]> {
    const result = await this.model
      .find(
        {
          is_validated: true,
        },
        { uid: 1, is_validated: 1 },
      )
      .lean();

    return result.map((r: UserDoc) => this.userMapper.toDomain(r));
  }
}
