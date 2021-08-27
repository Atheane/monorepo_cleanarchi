import { CoreTypes, WriteService } from '@oney/common-core';
import { Profile, ProfileRepositoryWrite } from '@oney/profile-core';
import { inject, injectable } from 'inversify';
import { ProfileMapper } from '../../mappers/ProfileMapper';
import { MongodbProfile } from '../../models/MongodbProfile';

@injectable()
export class OdbProfileRepositoryWrite implements ProfileRepositoryWrite {
  constructor(
    @inject(CoreTypes.writeService) private readonly _writeService: WriteService,
    private readonly _profileMapper: ProfileMapper,
  ) {}

  async save(data: Profile): Promise<Profile> {
    const profileToSave: MongodbProfile = this._profileMapper.fromDomain(data);
    const result: MongodbProfile = await this._writeService.updateOne(profileToSave.uid, profileToSave);
    const profileToReturn: Profile = this._profileMapper.toDomain(result);
    return new Profile(profileToReturn.props);
  }
}
