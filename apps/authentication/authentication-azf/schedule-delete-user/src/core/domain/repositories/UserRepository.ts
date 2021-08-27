import { User, UserProperties } from '../entities/User';
import { UserProviderMetadatas } from '../types/UserProviderMetadatas';

export interface UserRepository {
  filterBy(predicate: UserProviderMetadatas): Promise<User[]>;
  deleteMany(predicate: UserProviderMetadatas): Promise<User[]>;
  save(userProps: UserProperties): Promise<User>;
}
