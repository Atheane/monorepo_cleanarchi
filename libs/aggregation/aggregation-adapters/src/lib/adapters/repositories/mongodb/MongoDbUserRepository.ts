import { User, UserRepository, UserError, UserProperties } from '@oney/aggregation-core';
import { Dictionary } from '@oney/common-core';
import { defaultLogger } from '@oney/logger-adapters';
import { injectable } from 'inversify';
import { UserModel } from './models/UserModel';

@injectable()
export class MongoDbUserRepository implements UserRepository {
  private userModel = UserModel;

  async findBy(predicate: Dictionary<string>): Promise<User> {
    const result = await this.userModel.findOne(predicate).lean();
    if (!result) {
      defaultLogger.error('@oney/aggregation.MongoDbUserRepository.getById.user_unknown');
      throw new UserError.UserUnknown();
    }
    return new User(result);
  }

  async create(userProps: UserProperties): Promise<User> {
    try {
      const result = await this.userModel.create(userProps);
      return new User({
        userId: result.userId,
        consent: result.consent,
        consentDate: result.consentDate,
      });
    } catch (e) {
      defaultLogger.error('@oney/aggregation.MongoDbUserRepository.create.catch', { e });
      throw new UserError.UserAlreadyExists();
    }
  }

  async update(userId: string, partialProps: Partial<UserProperties>): Promise<User> {
    const result = await this.userModel
      .findOneAndUpdate(
        {
          userId,
        },
        { ...partialProps, updatedAt: new Date() },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        },
      )
      .select('-_id')
      .lean();
    return new User({
      ...result,
    });
  }

  async deleteOne(userId: string): Promise<void> {
    await this.userModel.deleteOne({ userId });
  }
}
