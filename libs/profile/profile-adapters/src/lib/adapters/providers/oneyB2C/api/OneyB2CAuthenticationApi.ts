import { IHttpBuilder } from '@oney/http';
import { sign, SignOptions } from 'jsonwebtoken';
import { ProfileErrors } from '@oney/profile-core';
import * as querystring from 'querystring';
import { DigitalIdentityResponse } from '../models/DigitalIdentityResponse';

export interface OneyB2CConfiguration {
  tokenExpiration: string;
  odbOneyB2CKeyId: string;
  odbOneyB2CApiClientId: string;
  odbOneyB2CApiClientSecret: string;
  odbOneyB2CKey: string;
  OdbOneyB2CApiXAuthAuthor: string;
  OdbOneyB2CApiXAuthAuthent: string;
  apiVersion: string;
}

type GeneratedIdentity = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
};

export class OneyB2CAuthenticationApi {
  constructor(private readonly _http: IHttpBuilder, private readonly _config: OneyB2CConfiguration) {}

  async generateIdentityHolder(scope: string, authToken?: string): Promise<GeneratedIdentity> {
    const params = {
      client_id: this._config.odbOneyB2CApiClientId,
      client_secret: this._config.odbOneyB2CApiClientSecret,
      grant_type: scope,
    };

    if (authToken) {
      params['assertion'] = authToken;
    }

    const result = await this._http
      .setAdditionnalHeaders({
        'X-Oney-Authorization': this._config.OdbOneyB2CApiXAuthAuthor,
        'Content-Type': 'application/x-www-form-urlencoded',
      })
      .post<GeneratedIdentity>(
        '/resources/authorizations/' + this._config.apiVersion + '/oauth/token',
        querystring.encode(params),
      )
      .execute();
    return result.data;
  }

  async getDigitalIdentity(email: string): Promise<DigitalIdentityResponse> {
    try {
      const getAuthorizationToken = await this.generateIdentityHolder('client_credentials');
      const result = await this._http
        .setAdditionnalHeaders({
          'Content-Type': 'application/json',
          'X-Oney-Authorization': this._config.OdbOneyB2CApiXAuthAuthent,
          Authorization: `Bearer ${getAuthorizationToken.access_token}`,
        })
        .get('/b2c/authentication/' + this._config.apiVersion + '/digital_identities', {
          selector_type: 'authentication_factor',
          selector_subtype: 'EML',
          selector_value: email,
        })
        .execute();
      return result.data[0];
    } catch (e) {
      if (e.cause && e.cause.status === 404) {
        throw new ProfileErrors.ProfileNotFound('DIGITAL_IDENTITY_NOT_FOUND');
      }
      throw e;
    }
  }

  async createDigitalIdentity(email: string): Promise<DigitalIdentityResponse> {
    const getAuthorizationToken = await this.generateIdentityHolder('client_credentials');
    const result = await this._http
      .setAdditionnalHeaders({
        'Content-Type': 'application/json',
        'X-Oney-Authorization': this._config.OdbOneyB2CApiXAuthAuthent,
        Authorization: `Bearer ${getAuthorizationToken.access_token}`,
      })
      .post<DigitalIdentityResponse>(
        '/b2c/authentication/' + this._config.apiVersion + '/digital_identities',
        {
          authentication_factor: {
            type: 'EML',
            public_value: email,
          },
        },
        null,
      )
      .execute();
    return result.data;
  }

  async generateToken(email: string): Promise<string> {
    const digitalIdentity = await this.getDigitalIdentity(email);
    const options: SignOptions = {
      issuer: 'ODB',
      subject: `inoid${digitalIdentity.id}`,
      expiresIn: this._config.tokenExpiration,
      algorithm: 'RS256',
      header: {
        kid: this._config.odbOneyB2CKeyId,
      },
    };
    const payload = {
      flowsteps: ['SCA_INAPP'],
      client_id: this._config.odbOneyB2CApiClientId,
      identifiers: digitalIdentity.identifiers,
    };
    const decodeKey = Buffer.from(this._config.odbOneyB2CKey, 'base64')
      .toString('utf-8')
      .replace(/\\n/g, '\n');
    return sign(payload, decodeKey, options);
  }

  async getToken(email: string): Promise<string> {
    const authToken = await this.generateToken(email);
    const generatedIdentity = await this.generateIdentityHolder(
      'urn:ietf:params:oauth:grant-type:jwt-bearer',
      authToken,
    );
    this._http.setAdditionnalHeaders(
      {
        'X-Oney-Language-Code': 'fr',
        'X-Oney-Partner-Country-Code': 'FR',
        'Content-Type': 'application/json',
        'X-Oney-Authorization': this._config.OdbOneyB2CApiXAuthAuthent,
        'X-Oney-Media-Code': 'Application_Mobile',
        'X-Oney-User-Type': 'Client',
        'client-id': this._config.odbOneyB2CApiClientId,
      },
      true,
    );
    return generatedIdentity.access_token;
  }
}
