import { IdentityEncoder } from '../gateways/identity/IdentityEncoder';

export interface IdentityEncodingService {
  authToken: IdentityEncoder;
  scaToken: IdentityEncoder;
}
