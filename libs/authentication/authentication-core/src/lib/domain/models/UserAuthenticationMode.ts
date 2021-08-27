import { AuthFactor } from '../types/AuthFactor';
import { Channel } from '../types/Channel';

export interface UserAuthenticationMode {
  authFactor: AuthFactor;
  channel: Channel;
}
