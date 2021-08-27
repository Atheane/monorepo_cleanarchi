import { jest } from '@jest/globals';
import { Container } from 'inversify';
import { CoreTypes, QueryService } from '@oney/common-core';
import { buildProfileAdapterLib, ProfileGenerator } from '@oney/profile-adapters';
import {
  KycFraudType,
  OtScoringReceived,
  ProfileStatus,
  TaxNoticeAnalysisRejected,
  TaxNoticeAnalysisSucceeded,
} from '@oney/profile-messages';
import { KycDecisionType, UpdateProfileScoring } from '@oney/profile-core';
import { EventDispatcher } from '@oney/messages-core';
import * as nock from 'nock';
import { defaultLogger } from '@oney/logger-adapters';
import { config, identityConfig } from '../../fixtures/config';
import { MongodbProfile } from '../../../adapters/models/MongodbProfile';
import { ScoringReceivedHandler } from '../../../adapters/events/oneytrust/ScoringReceivedHandler';

jest.mock('@azure/service-bus', () => ({
  ReceiveMode: {
    peekLock: 1,
    receiveAndDelete: 2,
  },
  ServiceBusClient: {
    createFromConnectionString: jest.fn().mockReturnValue({
      createTopicClient: jest.fn().mockReturnValue({
        createSender: jest.fn().mockReturnValue({
          send: jest.fn(),
        }),
      }),
      createSubscriptionClient: jest.fn().mockReturnValue({
        createReceiver: jest.fn().mockReturnValue({
          registerMessageHandler: jest.fn(),
        }),
      }),
    }),
  },
}));

describe('ScoringReceivedHandler integration test', () => {
  const userId = 'beGe_flCm';
  const caseReference = 'SP_2021212_beGe_flCm_frDNGY01Y';
  const entityReference = 3000001341;
  const login = 'api-3000001341-1@oneytrust.com';
  const container = new Container();

  let queryService: QueryService;
  let profileGenerator: ProfileGenerator;
  let eventDispatcherSpy;

  beforeAll(async () => {
    await buildProfileAdapterLib(container, config, identityConfig);
    queryService = container.get(CoreTypes.queryService);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    profileGenerator = container.get(ProfileGenerator);
  });

  beforeEach(() => {
    jest.restoreAllMocks();
    eventDispatcherSpy = jest.spyOn(container.get(EventDispatcher), 'dispatch');
    nock('https://api-staging.oneytrust.com')
      .post(`/tulipe/v2/${entityReference}/cases/${caseReference}/dataRecovery`, { login })
      .reply(200, {
        details: {
          elements: [
            {
              elementId: '119526',
              lastUpdate: '2021-03-24 14:07:25',
              elementSubCategory: 'IRPP',
              data: {
                documentType: 'IC',
                referenceIncome: '11',
                globalGrossIncome: '22',
                establishmentDate: '2019-07-09',
                personalSituation: '2',
              },
            },
          ],
        },
      });
  });

  it('should update profile scoring', async () => {
    //Arrange
    await profileGenerator.generate(userId, ProfileStatus.ON_BOARDING);
    const handler = new ScoringReceivedHandler(container.get(UpdateProfileScoring), defaultLogger);
    const domainEvent: OtScoringReceived = new OtScoringReceived({
      uid: userId,
      caseReference: caseReference,
      caseId: 1,
      decisionScore: 2,
      decision: KycDecisionType.OK,
      sanctioned: KycDecisionType.PENDING_REVIEW,
      politicallyExposed: KycDecisionType.KO_MANUAL,
      compliance: KycDecisionType.PENDING_CLIENT,
      fraud: KycFraudType.RISK_MEDIUM,
    });

    //Act
    await handler.handle(domainEvent);

    //Assert
    const result: MongodbProfile = await queryService.findOne({ uid: userId });
    expect(result.kyc.caseId).toEqual(1);
    expect(result.kyc.decisionScore).toEqual(2);
    expect(result.kyc.decision).toEqual(KycDecisionType.OK);
    expect(result.kyc.sanctioned).toEqual(KycDecisionType.PENDING_REVIEW);
    expect(result.kyc.politicallyExposed).toEqual(KycDecisionType.KO_MANUAL);
    expect(result.kyc.compliance).toEqual(KycDecisionType.PENDING_CLIENT);
    expect(result.kyc.fraud).toEqual(KycFraudType.RISK_MEDIUM);
  });

  it('should dispatch TaxNoticeAnalysisSucceeded when profile status is ACTION_REQUIRED_TAX_NOTICE and OT decision is OK', async () => {
    //Arrange
    const handler = new ScoringReceivedHandler(container.get(UpdateProfileScoring), defaultLogger);
    await profileGenerator.generate(
      userId,
      ProfileStatus.ACTION_REQUIRED_TAX_NOTICE,
      caseReference,
      KycDecisionType.OK,
      '',
      true,
    );
    const domainEvent: OtScoringReceived = new OtScoringReceived({
      uid: userId,
      caseReference: caseReference,
      caseId: 1,
      decisionScore: 2,
      decision: KycDecisionType.OK,
      sanctioned: KycDecisionType.PENDING_REVIEW,
      politicallyExposed: KycDecisionType.KO_MANUAL,
      compliance: KycDecisionType.PENDING_CLIENT,
      fraud: KycFraudType.RISK_MEDIUM,
    });

    //Act
    await handler.handle(domainEvent);

    //Assert
    const result = eventDispatcherSpy.mock.calls[0][0];
    expect(result).toBeInstanceOf(TaxNoticeAnalysisSucceeded);
    expect(result.props).toEqual({ globalGrossIncome: '22', personalSituationCode: '2' });
  });

  it('should dispatch TaxNoticeAnalysisSucceeded when profile status is ACTION_REQUIRED_TAX_NOTICE and OT decision is OK_MANUAL', async () => {
    //Arrange
    const handler = new ScoringReceivedHandler(container.get(UpdateProfileScoring), defaultLogger);
    await profileGenerator.generate(
      userId,
      ProfileStatus.ACTION_REQUIRED_TAX_NOTICE,
      caseReference,
      KycDecisionType.OK,
      '',
      true,
    );
    const domainEvent: OtScoringReceived = new OtScoringReceived({
      uid: userId,
      caseReference: caseReference,
      caseId: 1,
      decisionScore: 2,
      decision: KycDecisionType.OK_MANUAL,
      sanctioned: KycDecisionType.PENDING_REVIEW,
      politicallyExposed: KycDecisionType.KO_MANUAL,
      compliance: KycDecisionType.PENDING_CLIENT,
      fraud: KycFraudType.RISK_MEDIUM,
    });

    //Act
    await handler.handle(domainEvent);

    //Assert
    const result = eventDispatcherSpy.mock.calls[0][0];
    expect(result).toBeInstanceOf(TaxNoticeAnalysisSucceeded);
    expect(result.props).toEqual({ globalGrossIncome: '22', personalSituationCode: '2' });
  });

  it('should dispatch TaxNoticeAnalysisRejected when profile status is tax notice is uploaded and OT decision is not KO', async () => {
    //Arrange
    const handler = new ScoringReceivedHandler(container.get(UpdateProfileScoring), defaultLogger);
    await profileGenerator.generate(
      userId,
      ProfileStatus.ACTION_REQUIRED_TAX_NOTICE,
      caseReference,
      KycDecisionType.OK,
      '',
      true,
    );
    const domainEvent: OtScoringReceived = new OtScoringReceived({
      uid: userId,
      caseReference: caseReference,
      caseId: 1,
      decisionScore: 2,
      decision: KycDecisionType.KO_MANUAL,
      sanctioned: KycDecisionType.PENDING_REVIEW,
      politicallyExposed: KycDecisionType.KO_MANUAL,
      compliance: KycDecisionType.PENDING_CLIENT,
      fraud: KycFraudType.RISK_MEDIUM,
    });

    //Act
    await handler.handle(domainEvent);

    //Assert
    const result = eventDispatcherSpy.mock.calls[0][0];
    expect(result).toBeInstanceOf(TaxNoticeAnalysisRejected);
  });
});
