import * as _ from 'lodash';
import { injectable } from 'inversify';
import { UserError } from '@oney/authentication-core';
import { UserRepository } from '../../core/domain/repositories/UserRepository';
import { User, UserProperties } from '../../core/domain/entities/User';
import { UserProviderMetadatas } from '../../core/domain/types/UserProviderMetadatas';

@injectable()
export class InMemoryUserRepository implements UserRepository {
  constructor(private store: Map<string, UserProperties>) {}

  async filterBy(predicate: UserProviderMetadatas): Promise<User[]> {
    const result = _.filter(Array.from(this.store.values()), predicate);
    if (result.length === 0) {
      throw new UserError.UserNotFound('NO_USERS_PP_DE_REVE');
    }
    const users = result.map(userProp => new User({ ...userProp }));
    return Promise.resolve(users);
  }

  deleteMany(predicate: UserProviderMetadatas): Promise<User[]> {
    const result = _.filter(Array.from(this.store.values()), predicate);
    if (result.length === 0) {
      throw new UserError.UserNotFound('NO_USERS_PP_DE_REVE');
    }
    const users = result.map(userProp => new User({ ...userProp }));
    result.forEach((userProp: UserProperties) => this.store.delete(userProp.uid));
    return Promise.resolve(users);
  }

  save(userProps: UserProperties): Promise<User> {
    this.store.set(userProps.uid, userProps);
    return Promise.resolve(new User(this.store.get(userProps.uid)));
  }
}
