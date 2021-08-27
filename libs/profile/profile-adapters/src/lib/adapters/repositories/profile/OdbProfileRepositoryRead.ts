import { CoreTypes, QueryService } from '@oney/common-core';
import { Profile, ProfileErrors, ProfileRepositoryRead } from '@oney/profile-core';
import { inject, injectable } from 'inversify';
import { ProfileMapper } from '../../mappers/ProfileMapper';
import { MongodbProfile } from '../../models/MongodbProfile';

@injectable()
export class OdbProfileRepositoryRead implements ProfileRepositoryRead {
  constructor(
    @inject(CoreTypes.queryService) private readonly _queryService: QueryService,
    private readonly _profileMapper: ProfileMapper,
  ) {}

  async getUserById(id: string): Promise<Profile> {
    const profile = await this._queryService.findOne<MongodbProfile>({ uid: id });
    if (!profile) {
      throw new ProfileErrors.ProfileNotFound('PROFILE_NOT_FOUND');
    }
    return this._profileMapper.toDomain(profile);
  }

  async getProfileByCaseReference(caseReference: string): Promise<Profile> {
    const profile = await this._queryService.findOne<MongodbProfile>({
      'kyc.case_reference': caseReference,
    }); // Already test in profileAzf function.
    /* istanbul ignore next */ if (!profile) {
      throw new ProfileErrors.ProfileNotFound('PROFILE_NOT_FOUND');
    }
    return this._profileMapper.toDomain(profile);
  }
}
