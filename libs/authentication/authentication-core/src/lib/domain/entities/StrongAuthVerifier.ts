import { PublicProperties } from '@oney/common-core';
import { AuthFactor } from '../types/AuthFactor';
import { AuthStatus } from '../types/AuthStatus';
import { Channel } from '../types/Channel';
import { Action } from '../valueobjects/Action';
import { Customer } from '../valueobjects/Customer';

export class StrongAuthVerifier<M = object> {
  verifierId: string;

  status: AuthStatus;

  valid: boolean;

  factor: AuthFactor;

  channel: Channel;

  expirationDate: Date;

  consumedAt?: Date;

  credential?: string;

  action?: Action;

  metadatas?: M;

  customer: Customer;

  constructor(verifier?: PublicProperties<StrongAuthVerifier>) {
    Object.assign(this, { ...verifier, customer: new Customer(verifier.customer) });
  }

  isCredentialsValid(credential: string): boolean {
    return this.credential === credential;
  }

  isVerifierExpired(): boolean {
    return +new Date(this.expirationDate) < +new Date();
  }
}
