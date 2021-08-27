import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { Identifiers, Profile, ProfileRepositoryRead, ProfileRepositoryWrite } from '@oney/profile-core';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { inject, injectable } from 'inversify';
import { ProfileStatus } from '@oney/profile-messages';
import { ContractDocumentGateway } from '../../domain/gateways/ContractDocumentGateway';
import { Steps } from '../../domain/types/Steps';
import { ContractErrors } from '../../domain/models/ContractError';

export interface SignContractRequest {
  uid: string;
  date: Date;
}

@injectable()
export class SignContract implements Usecase<SignContractRequest, Profile> {
  constructor(
    @inject(Identifiers.profileRepositoryRead)
    private readonly _profileRepositoryRead: ProfileRepositoryRead,
    @inject(Identifiers.profileRepositoryWrite)
    private readonly _profileRepositoryWrite: ProfileRepositoryWrite,
    @inject(EventProducerDispatcher) private readonly eventDispatcher: EventProducerDispatcher,
    @inject(Identifiers.contractDocumentGateway)
    private readonly _contractDocumentGateway: ContractDocumentGateway,
    @inject(Identifiers.featureFlagProfileStatusSaga) private readonly isProfileStatusSagaActive: boolean,
  ) {}

  async execute({ uid, date }: SignContractRequest): Promise<Profile> {
    const profile = await this._profileRepositoryRead.getUserById(uid);
    if (profile.hasOnboardingStep(Steps.CONTRACT_STEP)) {
      profile.signContract(date);
      this._contractDocumentGateway.createAndSave(profile);
      if (profile.props.informations.status === ProfileStatus.ON_BOARDING) {
        if (!this.isProfileStatusSagaActive) {
          profile.updateStatus();
        }
      }

      await this._profileRepositoryWrite.save(profile);
      await this.eventDispatcher.dispatch(profile);

      return profile;
    }
    throw new ContractErrors.ContractSigned();
  }

  canExecute(identity: Identity, request: SignContractRequest): Promise<boolean> | boolean {
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
