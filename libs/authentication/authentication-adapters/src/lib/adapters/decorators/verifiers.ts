import { Action, ScaVerifierGateway, StrongAuthVerifier } from '@oney/authentication-core';
import { injectable } from 'inversify';

export enum VerifierServiceName {
  ICG = 'icg',
  ODB = 'odb',
}

export const verifiers = new Map<VerifierServiceName, any>();

@injectable()
export abstract class VerifierBase implements ScaVerifierGateway {
  abstract generateVerifier(
    userId?: string,
    action?: Action,
    byPassPinCode?: boolean,
  ): Promise<StrongAuthVerifier>;
  abstract verify(verifier: StrongAuthVerifier, credential?: string): Promise<StrongAuthVerifier>;
}

export function Verifier(verifier: VerifierServiceName) {
  return (target: any) => {
    verifiers.set(verifier, target);
  };
}
