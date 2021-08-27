import { RsaPublicKey } from '../../../types/RsaPublicKey';

export interface PublicKeyGateway {
  getPublicKeysFromConfig(): RsaPublicKey[];
}
