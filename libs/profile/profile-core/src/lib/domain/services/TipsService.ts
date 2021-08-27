import { Profile } from '../aggregates/Profile';
import { Tips } from '../aggregates/Tips';

export interface TipsService {
  serve(profile: Profile): Promise<Tips>;
}
