import { ProfileInfos } from '@oney/profile-messages';

export interface GetProfileInformationGateway {
  getById(uid: string): Promise<ProfileInfos>;
}
