import { Profile, ProfileRepositoryRead } from '@oney/profile-core';

export class ProfileRepositoryReadStub implements ProfileRepositoryRead {
  profiles: Profile[] = [];

  init(profile: Profile) {
    this.profiles = [profile];
  }

  getProfileByCaseReference(caseReference: string): Promise<Profile> {
    const result = this.profiles.find(profile => profile.props.kyc.caseReference === caseReference);
    return Promise.resolve(result);
  }

  /* istanbul ignore next: not required to test this branch */
  getUserById(id: string): Promise<Profile> {
    const result = this.profiles.find(profile => profile.props.uid === id);
    return Promise.resolve(result);
  }
}
