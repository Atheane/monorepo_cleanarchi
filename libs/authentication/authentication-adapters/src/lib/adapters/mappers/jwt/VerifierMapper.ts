/* eslint-disable */

import { AuthFactor, Channel, StrongAuthVerifier } from '@oney/authentication-core';
import { Mapper } from '@oney/common-core';

export type VerifierPayload = Pick<StrongAuthVerifier, 'verifierId' | 'action' | 'customer'>;
export type ImmuableVerifierProperties = Pick<
  StrongAuthVerifier,
  'verifierId' | 'action' | 'customer' | 'factor' | 'channel' | 'expirationDate' | 'metadatas'
>;

export class VerifierMapper implements Mapper<VerifierPayload, ImmuableVerifierProperties> {
  toDomain(raw: ImmuableVerifierProperties): VerifierPayload {
    const { verifierId, action, customer } = raw;
    return {
      verifierId,
      action,
      customer,
    };
  }

  fromDomain(t: StrongAuthVerifier): ImmuableVerifierProperties {
    const { verifierId, action, customer, factor, channel, expirationDate, metadatas } = t;
    return {
      verifierId,
      action,
      customer,
      factor,
      channel,
      expirationDate,
      ...(channel === Channel.SMS &&
        factor === AuthFactor.OTP && {
          metadatas: {
            otpLength: metadatas['otpLength'],
          },
        }),
    };
  }
}
