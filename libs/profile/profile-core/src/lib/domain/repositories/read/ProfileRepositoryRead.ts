import { Profile } from '../../aggregates/Profile';

export interface ProfileRepositoryRead {
  getUserById(id: string): Promise<Profile>;
  getProfileByCaseReference(caseReference: string): Promise<Profile>;
}
