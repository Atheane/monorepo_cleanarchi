import { Profile } from '@oney/profile-core';
import { Ficp } from '../types/Ficp';
import { FicpRequestId } from '../types/FicpRequestId';

export interface FicpGateway {
  getRequestId(profile: Profile): Promise<FicpRequestId>;

  getFlag(request: number): Promise<Ficp>;
}
