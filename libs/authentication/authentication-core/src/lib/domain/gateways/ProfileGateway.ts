import { User } from '../aggregates/User';

export interface ProfileGateway {
  create(user: User): Promise<void>;
}
