import { Dictionary } from '@oney/common-core';
import { User, UserProperties } from '../aggregates/User';

export interface UserRepository {
  findBy(predicate: Dictionary<string>): Promise<User>;
  create(userProps: UserProperties): Promise<User>;
  update(userId: string, partialProps: Partial<UserProperties>): Promise<User>;
  deleteOne(userId: string): Promise<void>;
}
