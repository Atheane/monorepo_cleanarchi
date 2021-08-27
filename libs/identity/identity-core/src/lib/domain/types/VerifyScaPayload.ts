import { Action } from './ScaVerifier';
import { Identity } from '../entities/Identity';

export type VerifyScaPayload = {
  identity: Identity;
  request?: Action;
};
