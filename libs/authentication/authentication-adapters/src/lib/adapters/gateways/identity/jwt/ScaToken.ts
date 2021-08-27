import { IdentityEncoder } from '@oney/authentication-core';
import { injectable } from 'inversify';
import * as jwt from 'jsonwebtoken';
import { JwtConfiguration, JwtSettings, TokenType } from '../../../models/JwtConfiguration';

@injectable()
export class ScaToken extends JwtConfiguration implements IdentityEncoder {
  private readonly jwtConfig: JwtSettings;

  constructor(jwtConfig: JwtSettings) {
    super(TokenType.SCA_TOKEN, jwtConfig);
    this.jwtConfig = this.getConfig();
  }

  encode<T extends Record<any, any>>(payload: T): string {
    const { secret, issuer, expiredAt, audience } = this.jwtConfig;
    return jwt.sign(payload, secret, {
      expiresIn: expiredAt(),
      issuer,
      audience,
    });
  }

  decode<T extends Record<any, any>>(hash: string): T {
    try {
      const { secret, issuer, audience } = this.jwtConfig;
      return jwt.verify(hash, secret, {
        ignoreExpiration: true,
        issuer,
        audience,
      }) as Record<any, any>;
    } catch (e) {
      return null;
    }
  }
}
