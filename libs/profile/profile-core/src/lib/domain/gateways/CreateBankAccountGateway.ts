import { BankAccount } from '@oney/payment-core';
import { Profile } from '../aggregates/Profile';

export interface CreateBankAccountGateway {
  create(profile: Profile): Promise<BankAccount>;
}
