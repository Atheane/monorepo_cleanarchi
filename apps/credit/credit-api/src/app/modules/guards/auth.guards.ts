import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { getAppConfiguration } from '../../../config/app/AppConfigurationService';
import { JwtUserPayload } from '../../../docs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getAppConfiguration().jwtSignatureKey,
    });
  }

  async validate(body: JwtUserPayload) {
    return {
      email: body.payload.user.email,
      uid: body.payload.user.uid,
    };
  }
}
