import { User } from '../../aggregates/User';

export interface AuthenticationGateway {
  signIn(email: string): Promise<User>;
}
