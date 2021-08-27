import { ProfileStatus } from '@oney/profile-messages';
import { Tips } from '../../aggregates/Tips';

export interface TipsRepositoryRead {
  get(uid: string, status?: ProfileStatus): Promise<Tips>;
}
