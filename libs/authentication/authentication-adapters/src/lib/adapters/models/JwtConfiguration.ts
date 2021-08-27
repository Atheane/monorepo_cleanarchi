// eslint-disable-next-line max-classes-per-file
export enum TokenType {
  SCA_TOKEN = 'sca_token',
  AUTH_TOKEN = 'auth_token',
}

export class CommonJwtConfiguration {
  expiredAt: () => number;

  issuer: string;

  audience: string;
}

export class JwtSettings extends CommonJwtConfiguration {
  secret: string;
}

export type MapTokenConfiguration = Map<TokenType, JwtSettings>;

export class JwtConfiguration {
  jwtSettings: MapTokenConfiguration;

  tokenType: TokenType;

  constructor(tokenType: TokenType, jwtConfig: JwtSettings) {
    this.tokenType = tokenType;
    this.jwtSettings = new Map();
    this.jwtSettings.set(tokenType, jwtConfig);
  }

  getConfig(): JwtSettings {
    const config = this.jwtSettings.get(this.tokenType);
    return {
      ...config,
      expiredAt: () => Math.round(config.expiredAt() / 1000),
    };
  }
}
