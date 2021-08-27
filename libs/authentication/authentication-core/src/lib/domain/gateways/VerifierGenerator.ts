import { User } from '../aggregates/User';
import { StrongAuthVerifier } from '../entities/StrongAuthVerifier';
import { Action } from '../valueobjects/Action';

export type VerifierContext<T, K = object> = T & {
  user: User;
  action: Action;
  result: K;
};

export interface VerifierGenerator<T> {
  generateVerifier(verifierContext: VerifierContext<T>): Promise<StrongAuthVerifier>;
}
