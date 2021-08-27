import { DomainError } from '@oney/common-core';
import { User } from '../aggregates/User';

export type ProvisioningFunctionalErrorCtor = new (uid: string, ...args: unknown[]) => DomainError;

export interface ProvisioningFunctionalErrorFactory {
  build(code: string, user: User): DomainError;
}
