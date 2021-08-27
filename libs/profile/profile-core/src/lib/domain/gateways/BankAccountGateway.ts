import { Profile } from '../aggregates/Profile';

export interface BankAccountGateway {
  create(profile: Profile): Promise<string>;
  getId(profile: Profile): Promise<string>;
}
