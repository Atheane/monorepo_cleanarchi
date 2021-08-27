import { User, UserError, UserRepository, UserProperties } from '@oney/aggregation-core';
import { defaultLogger } from '@oney/logger-adapters';
import { Dictionary } from '@oney/common-core';

export class InMemoryUserRepository implements UserRepository {
  constructor(private store: Map<string, UserProperties>) {}

  findBy(predicate: Dictionary<string>): Promise<User> {
    const predicateKeys = Object.keys(predicate) as [keyof UserProperties];
    const result: UserProperties = [...this.store.values()].find(item =>
      predicateKeys.every(key => item[key] === predicate[key]),
    );
    if (!result) {
      return Promise.reject(new UserError.UserUnknown());
    }
    return Promise.resolve(new User(result));
  }

  async create(userProps: UserProperties): Promise<User> {
    const userAlreadyExists = this.store.get(userProps.userId);
    if (userAlreadyExists) {
      defaultLogger.error('@oney/aggregation.MongoDbUserRepository.create.user_already_exists', {
        userId: userProps.userId,
      });
      throw new UserError.UserAlreadyExists();
    }
    const newUser = User.create(userProps);
    this.store.set(userProps.userId, newUser.props);
    return Promise.resolve(newUser);
  }

  async update(userId: string, partialProps: Partial<UserProperties>): Promise<User> {
    const existingUser = await this.findBy({ userId });
    const updatedUser = new User({ ...existingUser.props, ...partialProps });
    this.store.set(existingUser.props.userId, updatedUser.props);
    return updatedUser;
  }

  async deleteOne(userId: string): Promise<void> {
    const user = await this.findBy({ userId });
    this.store.delete(user.props.userId);
  }
}
