import { injectable } from 'inversify';
import { Model, Connection } from 'mongoose';
import { UserError } from '@oney/authentication-core';
import { UserDoc, getUserModel } from './models/UserModel';
import { UserRepository } from '../../core/domain/repositories/UserRepository';
import { User, UserProperties } from '../../core/domain/entities/User';
import { UserProviderMetadatas } from '../../core/domain/types/UserProviderMetadatas';
import { UserProvider } from '../../core/domain/types/UserProvider';

const recursiveSearch = (obj: object, mongoKey = '') => {
  let cumMongoKey = mongoKey;
  const key = Object.keys(obj)[0];
  const value = obj[key];
  cumMongoKey += key;
  if (typeof value === 'object') {
    return recursiveSearch(value, cumMongoKey + '.');
  }
  return cumMongoKey;
};

@injectable()
export class MongoDbUserRepository implements UserRepository {
  private readonly userModel: Model<UserDoc>;

  constructor(dbConnection: Connection) {
    this.userModel = getUserModel(dbConnection);
  }

  async filterBy(predicate: UserProviderMetadatas): Promise<User[]> {
    const mongoKeys = recursiveSearch(predicate);
    const predicateMongo = {} as object;
    predicateMongo[mongoKeys] = UserProvider.PP_DE_REVE;

    const result: UserProperties[] = await this.userModel.find(predicateMongo).lean();
    if (result.length === 0) {
      throw new UserError.UserNotFound('NO_USERS_PP_DE_REVE');
    }
    return result.map(
      userProps =>
        new User({
          ...userProps,
        }),
    );
  }

  async deleteMany(predicate: UserProviderMetadatas): Promise<User[]> {
    const mongoKeys = recursiveSearch(predicate);
    const predicateMongo = {} as object;
    predicateMongo[mongoKeys] = UserProvider.PP_DE_REVE;
    const usersProps: UserProperties[] = await this.userModel.find(predicateMongo);
    if (usersProps.length === 0) {
      throw new UserError.UserNotFound('NO_USERS_PP_DE_REVE');
    }
    await this.userModel.deleteMany(predicateMongo);
    return usersProps.map(userProps => new User(userProps));
  }

  async save(userProps: UserProperties): Promise<User> {
    await this.userModel.create(userProps);
    return new User(userProps);
  }
}
