import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { OtScoringReceived, Scoring } from '@oney/profile-messages';
import {
  KycDecisionType,
  Profile,
  ProfileRepositoryRead,
  ProfileRepositoryWrite,
  ScoringDataRecoveryGateway,
} from '@oney/profile-core';
import { EventProducerDispatcher } from '@oney/messages-core';
import { Identifiers } from '../../Identifiers';
import { FiscalData } from '../../domain/valuesObjects/FiscalData';

@injectable()
export class UpdateProfileScoring implements Usecase<OtScoringReceived, Profile> {
  constructor(
    @inject(Identifiers.profileRepositoryWrite)
    private readonly _profileRepositoryWrite: ProfileRepositoryWrite,
    @inject(Identifiers.profileRepositoryRead) private readonly _profileRepositoryRead: ProfileRepositoryRead,
    @inject(Identifiers.scoringDataRecoveryGateway)
    private readonly _scoringDataRecoveryGateway: ScoringDataRecoveryGateway,
    @inject(EventProducerDispatcher) private readonly eventDispatcher: EventProducerDispatcher,
    @inject(Identifiers.featureFlagProfileStatusSaga) private readonly isProfileStatusSagaActive: boolean,
  ) {}

  async execute(request: OtScoringReceived): Promise<Profile> {
    const updatedProfile: Profile = await this._profileRepositoryRead.getUserById(request.props.uid);
    const scoringValues: Scoring = {
      caseReference: request.props.caseReference,
      caseId: request.props.caseId,
      decisionScore: request.props.decisionScore,
      decision: request.props.decision,
      sanctioned: request.props.sanctioned,
      politicallyExposed: request.props.politicallyExposed,
      compliance: request.props.compliance,
      fraud: request.props.fraud,
    };

    if (updatedProfile.props.kyc.taxNoticeUploaded) {
      await this.checkTaxNoticeValidity(request, updatedProfile);
    }

    updatedProfile.updateScoring(scoringValues);
    updatedProfile.updateKycDecision();
    if (!this.isProfileStatusSagaActive) {
      updatedProfile.updateStatus();
    }

    await this._profileRepositoryWrite.save(updatedProfile);
    await this.eventDispatcher.dispatch(updatedProfile);
    return updatedProfile;
  }

  private async checkTaxNoticeValidity(request: OtScoringReceived, updatedProfile: Profile) {
    if ([KycDecisionType.OK, KycDecisionType.OK_MANUAL].includes(request.props.decision)) {
      const scoringData: FiscalData = await this._scoringDataRecoveryGateway.get({
        caseReference: updatedProfile.props.kyc.caseReference,
      });
      updatedProfile.validatedTaxNotice(scoringData);
    } else {
      updatedProfile.rejectTaxNotice();
    }
  }
}
