import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { PublicKeyGateway } from '../../../domain/gateways/crypto/rsa/PublicKeyGateway';
import { RsaPublicKey } from '../../../domain/types/RsaPublicKey';
import { AuthIdentifier } from '../../AuthIdentifier';

@injectable()
export class OneyTokenKeys implements Usecase<void, RsaPublicKey[]> {
  constructor(@inject(AuthIdentifier.publicKeyGateway) private readonly publicKeyGateway: PublicKeyGateway) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(request: void): Promise<RsaPublicKey[]> {
    return this.publicKeyGateway.getPublicKeysFromConfig();
  }
}
