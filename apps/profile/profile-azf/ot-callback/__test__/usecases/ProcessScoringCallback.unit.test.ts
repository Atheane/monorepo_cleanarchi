import 'reflect-metadata';
import { KYC, KycDecisionType, KycFraudType, Profile } from '@oney/profile-core';
import MockDate from 'mockdate';
import { ProcessScoringCallback } from '../../src/usecases/ProcessScoringCallback';
import { OtCallbackCommand } from '../../src/commands/OtCallbackCommand';
import { ProfileRepositoryReadStub } from '../_stubs_/ProfileRepositoryReadStub';
import { KycRepositoryWriteStub } from '../_stubs_/KycRepositoryWriteStub';
import { EventDispatcherStub } from '../_stubs_/EventDispatcherStub';

describe('ProcessScoringCallback unit test', () => {
  const profileRepositoryReadStub = new ProfileRepositoryReadStub();
  const kycRepositoryWriteStub = new KycRepositoryWriteStub();
  const eventDispatcherStub = new EventDispatcherStub();

  beforeEach(() => {
    const profile: Profile = new Profile({
      uid: 'beGe_flCm',
      kyc: new KYC({
        caseReference: 'SP_2021212_beGe_flCm_frDNGY01Y',
        eligibilityReceived: false,
        amlReceived: false,
      }),
    });
    MockDate.set(new Date('2021-02-18T00:00:00.000Z'));
    profileRepositoryReadStub.init(profile);
    kycRepositoryWriteStub.clear();
    eventDispatcherStub.clear();
  });

  it('should save OT callback payload to event store', async () => {
    //Arrange
    const usecase = new ProcessScoringCallback(
      profileRepositoryReadStub,
      kycRepositoryWriteStub,
      eventDispatcherStub,
    );
    const cmd = OtCallbackCommand.setProperties({
      caseId: 49718,
      caseReference: 'SP_2021212_beGe_flCm_frDNGY01Y',
      caseScore: '0',
      caseStateId: 4100,
      caseState: 'ANALYZED_FULL',
      decision: KycDecisionType.OK_MANUAL,
      subResult_fraud: KycFraudType.RISK_LOW,
      subResult_aml_pep: KycDecisionType.OK,
      subResult_compliance: KycDecisionType.OK,
      subResult_aml_sanctions: KycDecisionType.OK,
    });

    //Act
    await usecase.execute(cmd);

    //Assert
    expect(kycRepositoryWriteStub.Kyc).toHaveLength(1);
    expect(kycRepositoryWriteStub.Kyc[0]).toEqual({
      data: {
        caseId: 49718,
        caseReference: 'SP_2021212_beGe_flCm_frDNGY01Y',
        caseScore: 0,
        caseState: 'ANALYZED_FULL',
        caseStateId: 4100,
        decision: 'OK_MANUAL',
        subResult_aml_pep: 'OK',
        subResult_aml_sanctions: 'OK',
        subResult_bdf: undefined,
        subResult_compliance: 'OK',
        subResult_fraud: 'RISK_LOW',
      } as OtCallbackCommand,
      date: new Date('2021-02-18T00:00:00.000Z'),
    });
  });

  it('should dispatch OtScoringReceived event', async () => {
    //Arrange
    const usecase = new ProcessScoringCallback(
      profileRepositoryReadStub,
      kycRepositoryWriteStub,
      eventDispatcherStub,
    );
    const cmd = OtCallbackCommand.setProperties({
      caseId: 49718,
      caseReference: 'SP_2021212_beGe_flCm_frDNGY01Y',
      caseScore: '0',
      caseStateId: 4100,
      caseState: 'ANALYZED_FULL',
      decision: KycDecisionType.OK_MANUAL,
      subResult_fraud: KycFraudType.RISK_LOW,
      subResult_aml_pep: KycDecisionType.OK,
      subResult_compliance: KycDecisionType.OK,
      subResult_aml_sanctions: KycDecisionType.OK,
    });

    //Act
    await usecase.execute(cmd);

    //Assert
    expect(eventDispatcherStub.events).toHaveLength(1);
    expect(eventDispatcherStub.events[0].props).toEqual({
      caseId: 49718,
      caseReference: 'SP_2021212_beGe_flCm_frDNGY01Y',
      compliance: 'OK',
      decision: 'OK_MANUAL',
      decisionScore: 0,
      fraud: 'RISK_LOW',
      politicallyExposed: 'OK',
      sanctioned: 'OK',
      uid: 'beGe_flCm',
    });
  });
});
