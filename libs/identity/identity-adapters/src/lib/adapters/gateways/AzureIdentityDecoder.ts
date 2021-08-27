import { AuthErrors, Identity, IdentityDecoder, IdentityIdentifier } from '@oney/identity-core';
import { inject, injectable, unmanaged } from 'inversify';
import { TokenExpiredError, verify, VerifyOptions } from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import { AzureIdentityMapper } from '../mappers/AzureIdentityMapper';

@injectable()
export class AzureIdentityDecoder implements IdentityDecoder {
  client: jwksClient.JwksClient;

  constructor(
    @inject(IdentityIdentifier.odbIdentityMapper) private readonly azureIdentityMapper: AzureIdentityMapper,
    @unmanaged() private readonly tenantId: string,
    @unmanaged() private readonly verifyOptions: VerifyOptions,
    @unmanaged() private readonly _audience: string,
  ) {
    this.client = jwksClient({
      jwksUri: `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`,
    });
  }

  decode(holder: string): Promise<Identity> {
    const tokenHeaders = Buffer.from(holder.split('.')[0], 'base64').toString('utf-8');
    const parsedTokenHeaders = JSON.parse(tokenHeaders);
    return new Promise((resolve, reject) => {
      this.client.getSigningKey(parsedTokenHeaders.kid, (err, key) => {
        if (err != null) {
          return reject(new AuthErrors.IllegalIdentity('TOKEN_ERROR', err));
        }
        const signingKey = key.getPublicKey();
        try {
          const decoded = this._verifyToken(holder, signingKey);
          const audience = decoded['aud'].split('/').pop();
          if (audience !== this._audience) {
            throw new AuthErrors.IllegalIdentity('AUDIENCE_PROVIDED_IS_NOT_VALID');
          }
          // Retrieve service to and map the service and write in order to make an object for future user token signed.
          return resolve(this.azureIdentityMapper.toDomain(decoded));
        } catch (err) {
          if (err instanceof TokenExpiredError) {
            return reject(new AuthErrors.IllegalIdentity('TOKEN_EXPIRED', err));
          }
          reject(new AuthErrors.IllegalIdentity('TOKEN_ERROR', err));
        }
      });
    });
  }

  private _verifyToken(holder: string, signingKey: string) {
    return verify(holder, signingKey, { ...this.verifyOptions, algorithms: ['RS256'] });
  }
}
