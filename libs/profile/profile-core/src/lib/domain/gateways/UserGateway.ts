import { Profile } from '../aggregates/Profile';

export interface UserGateway {
  update(profile: Profile): Promise<Profile>;
}
