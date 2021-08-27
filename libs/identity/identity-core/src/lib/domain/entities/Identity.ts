import { IdentityProvider } from '../types/IdentityProvider';
import { Role } from '../valueobjects/Role';

export interface Identity {
  uid: string;
  roles: Role[];
  provider: IdentityProvider;
  name: string;
  ipAddress?: string;
  email?: string;
  scaHolder?: string;
}
