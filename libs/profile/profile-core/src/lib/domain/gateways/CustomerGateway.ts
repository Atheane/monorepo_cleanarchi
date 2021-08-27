import { Profile } from '../aggregates/Profile';
import { Situation } from '../types/Situation';
import { Consents } from '../valuesObjects/Consents';

export interface CustomerGateway {
  create(profile: Profile): Promise<Profile>;
  update(profile: Profile, isSendSid?: boolean): Promise<Profile>;
  upsert(profile: Profile): Promise<[Situation, Consents]>;
}
