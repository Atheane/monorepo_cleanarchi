import { User } from '../entities/User';

export interface UserRepository {
  getAllVerifiedUser(): Promise<User[]>;
}
