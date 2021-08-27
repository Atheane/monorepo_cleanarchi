import { StrongAuthVerifier } from '@oney/authentication-core';
import { Request } from 'express';

export type VerifierPayload = Pick<StrongAuthVerifier, 'verifierId' | 'action' | 'customer'>;

export interface ScaRequestPayload extends Request {
  verifier: VerifierPayload;
}
