import { Usecase } from '@oney/ddd';
import { Identity } from '@oney/identity-core';
import { EventDispatcher, EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { CivilStatusValidationFailed } from '@oney/profile-messages';
import { Identifiers } from '../../Identifiers';
import { Profile } from '../../domain/aggregates/Profile';
import { CustomerGateway } from '../../domain/gateways/CustomerGateway';
import { FolderGateway } from '../../domain/gateways/FolderGateway';
import { ProfileRepositoryRead } from '../../domain/repositories/read/ProfileRepositoryRead';
import { ProfileRepositoryWrite } from '../../domain/repositories/write/ProfileRepositoryWrite';
import { HonorificCode } from '../../domain/types/HonorificCode';
import { BirthDate } from '../../domain/valuesObjects/BirthDate';
import { BirthCountry } from '../../domain/valuesObjects/BirthCountry';

export interface CivilStatusRequest {
  gender: HonorificCode;
  firstName: string;
  birthName: string;
  birthDate: Date;
  birthCity: string;
  birthDepartmentCode: string;
  birthDistrictCode: string;
  birthCountry: string;
  nationality: string;
  legalName?: string;
}

@injectable()
export class CivilStatus implements Usecase<CivilStatusRequest, Profile> {
  constructor(
    @inject(Identifiers.profileRepositoryRead) private readonly profileRepositoryRead: ProfileRepositoryRead,
    @inject(Identifiers.customerGateway) public readonly _customerGateway: CustomerGateway,
    @inject(Identifiers.folderGateway) private readonly _updateFolderGateway: FolderGateway,
    @inject(Identifiers.profileRepositoryWrite)
    private readonly _profileRepositoryWrite: ProfileRepositoryWrite,
    @inject(EventDispatcher) private readonly eventDispatcher: EventDispatcher,
    @inject(EventProducerDispatcher) private readonly eventProducerDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: CivilStatusRequest, identity: Identity): Promise<Profile> {
    const profile = await this.profileRepositoryRead.getUserById(identity.uid);

    // Todo fix me, weird workflow from the try / catch
    let updatedProfile: Profile;
    try {
      updatedProfile = profile.civilStatus({
        ...profile.props.informations,
        honorificCode: request.gender,
        firstName: request.firstName,
        legalName: request.legalName,
        birthName: request.birthName,
        birthDate: new BirthDate(request.birthDate),
        birthCountry: new BirthCountry(request.birthCountry),
        birthCity: request.birthCity,
        birthDepartmentCode: request.birthDepartmentCode,
        birthDistrictCode: request.birthDistrictCode,
      });
    } catch (e) {
      const domainErrorEvent = new CivilStatusValidationFailed(e, {
        aggregateId: profile.id,
        aggregate: profile.getName(),
      });
      await this.eventDispatcher.dispatch(domainErrorEvent);
      throw e;
    }
    await this._updateFolderGateway.update(updatedProfile);
    const [situation, consents] = await this._customerGateway.upsert(updatedProfile);
    updatedProfile.attachSituation(situation, consents);
    await this._profileRepositoryWrite.save(updatedProfile);
    await this.eventProducerDispatcher.dispatch(updatedProfile);
    return updatedProfile;
  }
}
