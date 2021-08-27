import { Usecase } from '@oney/ddd';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../../Identifiers';
import { Profile } from '../../domain/aggregates/Profile';
import { FacematchGateway } from '../../domain/gateways/FacematchGateway';
import { ProfileRepositoryRead } from '../../domain/repositories/read/ProfileRepositoryRead';
import { ProfileRepositoryWrite } from '../../domain/repositories/write/ProfileRepositoryWrite';
import { FacematchResult } from '../../domain/types/FacematchResult';

export interface ValidateFacematchRequest {
  uid: string;
  customerRank: number;
  selfieConsent: boolean;
  selfieConsentDate: Date;
  result: FacematchResult;
  msg: string;
}

@injectable()
export class ValidateFacematch implements Usecase<ValidateFacematchRequest, Profile> {
  constructor(
    @inject(Identifiers.profileRepositoryRead) private readonly _profileRepositoryRead: ProfileRepositoryRead,
    @inject(Identifiers.profileRepositoryWrite)
    private readonly _profileRepositoryWrite: ProfileRepositoryWrite,
    @inject(Identifiers.facematchGateway) private readonly _facematchGateway: FacematchGateway,
    @inject(EventProducerDispatcher) private readonly _eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: ValidateFacematchRequest): Promise<Profile> {
    const profile = await this._profileRepositoryRead.getUserById(request.uid);

    if (request.result === FacematchResult.SKIPPED) {
      await this._facematchGateway.sendFacematch({
        caseReference: profile.props.kyc.caseReference,
        customerRank: request.customerRank,
        selfieConsent: false,
        selfieConsentDate: request.selfieConsentDate,
        result: FacematchResult.STOP,
        msg: request.msg,
      });
    }

    const profileUpdated = profile.validateFacematch({
      result: request.result === FacematchResult.SKIPPED ? FacematchResult.STOP : request.result,
      consent: request.selfieConsent,
      consentDate: request.selfieConsentDate,
    });
    await this._profileRepositoryWrite.save(profileUpdated);
    await this._eventDispatcher.dispatch(profileUpdated);

    return profile;
  }

  async canExecute(identity: Identity, request: ValidateFacematchRequest): Promise<boolean> {
    const scope = identity.roles.find(item => item.scope.name === ServiceName.profile);
    if (!scope) {
      return false;
    }

    if (
      identity.uid === request.uid &&
      scope.permissions.write === Authorization.self &&
      scope.permissions.read === Authorization.self
    ) {
      return true;
    }

    return false;
  }
}
