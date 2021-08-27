import { Maybe } from '@oney/common-core';
import { User } from '../aggregates/User';

export interface UserRepository {
  save(user: User): Promise<User>;
  getById(id: string): Promise<Maybe<User>>;
  findByEmail(email: string): Promise<Maybe<User>>;
  //TODO findByPhone method
}
