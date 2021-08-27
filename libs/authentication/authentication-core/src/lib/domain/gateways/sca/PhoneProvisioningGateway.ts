import { User } from '../../aggregates/User';

export interface PhoneProvisioningGateway {
  registerPhone(user: User): Promise<void>;
}
