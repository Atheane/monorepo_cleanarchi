import { AuthErrors, IdentityProvider, ProviderGateway } from '@oney/identity-core';
import { injectable } from 'inversify';
import { decode } from 'jsonwebtoken';

@injectable()
export class OdbIdentityProvider implements ProviderGateway {
  async find(holder: string): Promise<IdentityProvider> {
    try {
      const decoded = decode(holder);
      if (decoded['provider'] !== IdentityProvider.odb && decoded['iss'] !== 'odb_authentication') {
        return IdentityProvider.azure;
      }
      return IdentityProvider.odb;
    } catch (e) {
      throw new AuthErrors.MalformedHolderIdentity('BAD_TOKEN_PROVIDED');
    }
  }
}
