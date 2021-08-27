import { Profile } from '../../aggregates/Profile';

export interface ProfileRepositoryWrite {
  save(data: Profile): Promise<Profile>;
}
