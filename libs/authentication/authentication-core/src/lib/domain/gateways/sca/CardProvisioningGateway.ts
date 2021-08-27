import { User } from '../../aggregates/User';

export interface CardProvisioningGateway {
  registerCard(user: User): Promise<User>;
}
