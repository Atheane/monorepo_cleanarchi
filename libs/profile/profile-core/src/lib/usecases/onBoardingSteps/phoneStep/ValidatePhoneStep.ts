import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { Identifiers } from '../../../Identifiers';
import { ProfileRepositoryRead } from '../../../domain/repositories/read/ProfileRepositoryRead';
import { Profile } from '../../../domain/aggregates/Profile';
import { ProfileRepositoryWrite } from '../../../domain/repositories/write/ProfileRepositoryWrite';
import { FolderGateway } from '../../../domain/gateways/FolderGateway';
import { OtpRepositoryRead } from '../../../domain/repositories/read/OtpRepositoryRead';
import { OtpErrors } from '../../../domain/models/OtpError';
import { IdGenerator } from '../../../domain/gateways/IdGenerator';
import { OtpRepositoryWrite } from '../../../domain/repositories/write/OtpRepositoryWrite';
import { OtpGateway } from '../../../domain/gateways/OtpGateway';
import { ProfileErrors } from '../../../domain/models/ProfileError';

export interface ValidatePhoneStepRequest {
  uid: string;
  code: string;
}

@injectable()
export class ValidatePhoneStep implements Usecase<ValidatePhoneStepRequest, Profile> {
  constructor(
    @inject(Identifiers.idGenerator) private readonly _idGenerator: IdGenerator,
    @inject(Identifiers.otpRepositoryRead) private readonly _otpRepositoryRead: OtpRepositoryRead,
    @inject(Identifiers.otpRepositoryWrite) private readonly _otpRepositoryWrite: OtpRepositoryWrite,
    @inject(Identifiers.profileRepositoryRead) private readonly _profileRepositoryRead: ProfileRepositoryRead,
    @inject(Identifiers.profileRepositoryWrite)
    private readonly _profileRepositoryWrite: ProfileRepositoryWrite,
    @inject(Identifiers.folderGateway) private readonly _folderGateway: FolderGateway,
    @inject(Identifiers.otpGateway) private readonly _otpGateway: OtpGateway,
    @inject(EventProducerDispatcher) private readonly eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: ValidatePhoneStepRequest): Promise<Profile> {
    const otp = await this._otpRepositoryRead.getOtpByUid(request.uid);

    if (this._otpGateway.isExpired(otp)) {
      throw new OtpErrors.OtpExpired('Expired OTP Code');
    }

    if (!this._otpGateway.isValid(otp, request.code)) {
      throw new OtpErrors.OtpInvalid('Invalid OTP Code');
    }

    const profile = await this._profileRepositoryRead.getUserById(request.uid);

    if (!profile) {
      throw new ProfileErrors.ProfileNotFound('Profile not found');
    }

    const now = new Date();
    // To keep consistency with legacy we keep the same case reference construction
    const caseReference = `SP_${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}_${
      request.uid
    }_${this._idGenerator.generateUniqueID()}`;
    const createdFolder = await this._folderGateway.create({
      caseReference,
      masterReference: profile.props.uid,
      email: profile.props.email,
      phone: otp.props.phone,
    });

    profile.validatePhoneStep(otp.props.phone, caseReference, createdFolder.location);

    await this._profileRepositoryWrite.save(profile);
    await this.eventDispatcher.dispatch(profile);
    await this._otpRepositoryWrite.delete(otp);
    return profile;
  }

  async canExecute(identity: Identity, request: ValidatePhoneStepRequest): Promise<boolean> {
    const scope = identity.roles.find(item => item.scope.name === ServiceName.profile);
    if (!scope) {
      return false;
    }

    return (
      identity.uid === request.uid &&
      scope.permissions.write === Authorization.self &&
      scope.permissions.read === Authorization.self
    );
  }
}
