import { AsyncOrSync } from 'ts-essentials';
import {
  CountryCode,
  IdentityDocumentValidated,
  OtScoringReceived,
  OtScoringReceivedProps,
  ProfileActivated,
  ProfileCreated,
  ProfileDocumentProps,
  ProfileRejected,
  ProfileStatus,
  ProfileStatusChanged,
  TaxNoticeUploaded,
} from '@oney/profile-messages';
import { Connection } from 'mongoose';
import { KycDecisionType, KycFraudType } from '@oney/profile-core';
import { DomainEvent } from '@oney/ddd';
import { BankAccountAggregated } from '@oney/aggregation-messages';
import { AccountEligibilityCalculated } from '@oney/cdp-messages';
import { LcbFtRiskLevel, LcbFtUpdated } from '@oney/payment-messages';
import { MongooseScope, MongoScope, sagaInitialize, SetupMongoMemory } from '@oney/saga-adapters';
import { ProfileStatusSaga } from '../../adapters/saga/ProfileStatusSaga';

describe('ProfileSaga test', () => {
  const uid = 'beGe_flCm';
  const email = 'mlamim263dev@mailsac.com';
  const digitalIdentityId = 'ZZjgUk_Ciqx-r1YIBEFrnHd7nRwp1zkXQmmwpPs88k2hotbq';

  SetupMongoMemory();

  const scopeFactory = async <T>(fn: (connection: Connection) => AsyncOrSync<T>) => {
    await MongoScope(async dbCtx => {
      await MongooseScope(dbCtx.uri, dbCtx.dbName, async connection => {
        return fn(connection);
      });
    });
  };

  it('should saga be active when ProfileCreated event is received', async () => {
    await scopeFactory(async connection => {
      const services = await sagaInitialize(connection, r => {
        r.register(ProfileStatusSaga);
      });
      //Arrange
      const profileCreatedEvent = new ProfileCreated({
        uid: uid,
        email: email,
        steps: [],
        digitalIdentityId: digitalIdentityId,
        status: ProfileStatus.ON_BOARDING,
      });
      profileCreatedEvent.metadata = { aggregate: 'profile', aggregateId: uid };

      //Act
      await services.dispatch(profileCreatedEvent);

      //Assert
      await services.checkActiveSagaCount(ProfileStatusSaga, 1);
    });
  });

  it('should update saga state when ProfileCreated event is received', async () => {
    await scopeFactory(async connection => {
      const services = await sagaInitialize(connection, r => {
        r.register(ProfileStatusSaga);
      });
      //Arrange
      const profileCreatedEvent = new ProfileCreated({
        uid: uid,
        email: email,
        steps: [],
        digitalIdentityId: digitalIdentityId,
        status: ProfileStatus.ON_BOARDING,
      });
      profileCreatedEvent.metadata = { aggregate: 'profile', aggregateId: uid };

      //Act
      await services.dispatch(profileCreatedEvent);

      //Assert
      const [activeSaga] = await services.finder.findActiveSagasBySaga(ProfileStatusSaga);
      expect(activeSaga.instance.state.uid).toEqual(uid);
      expect(activeSaga.instance.state.status).toEqual(ProfileStatus.ON_BOARDING);
    });
  });

  it('should update saga state when OtScoringReceived event is received', async () => {
    await scopeFactory(async connection => {
      const services = await sagaInitialize(connection, r => {
        r.register(ProfileStatusSaga);
      });
      //Arrange
      await startProfileSaga(services);
      const otScoringUpdated = new OtScoringReceived({
        uid: uid,
        decision: KycDecisionType.PENDING_REVIEW,
        fraud: KycFraudType.RISK_HIGH,
        compliance: KycDecisionType.PENDING_CLIENT,
      } as OtScoringReceivedProps);

      //Act
      await services.dispatch(otScoringUpdated);

      //Assert
      const [activeSaga] = await services.finder.findActiveSagasBySaga(ProfileStatusSaga);
      expect(activeSaga.instance.state.scoring).toEqual({
        decision: KycDecisionType.PENDING_REVIEW,
        fraud: KycFraudType.RISK_HIGH,
        compliance: KycDecisionType.PENDING_CLIENT,
      });
    });
  });

  it('should update saga state when IdentityDocumentValidated event is received', async () => {
    await scopeFactory(async connection => {
      const services = await sagaInitialize(connection, r => {
        r.register(ProfileStatusSaga);
      });
      //Arrange
      await startProfileSaga(services);
      await applyOtScoringReceived(services);
      const identityDocumentValidated = new IdentityDocumentValidated({
        nationality: CountryCode.MA,
      });
      identityDocumentValidated.metadata = { aggregate: 'profile', aggregateId: uid };

      //Act
      await services.dispatch(identityDocumentValidated);

      //Assert
      await services.checkActiveSagaCount(ProfileStatusSaga, 1);
    });
  });

  it('should update saga state when TaxNoticeUploaded event is received', async () => {
    await scopeFactory(async connection => {
      const services = await sagaInitialize(connection, r => {
        r.register(ProfileStatusSaga);
      });
      //Arrange
      await startProfileSaga(services);
      await applyOtScoringReceived(services);
      const taxNoticeUploaded = new TaxNoticeUploaded({
        document: {} as ProfileDocumentProps,
      });
      (taxNoticeUploaded as DomainEvent).metadata = { aggregate: 'profile', aggregateId: uid };

      //Act
      await services.dispatch(taxNoticeUploaded);

      //Assert
      await services.checkActiveSagaCount(ProfileStatusSaga, 1);
    });
  });

  it('should update saga state when LcbFtUpdated event is received', async () => {
    await scopeFactory(async connection => {
      const services = await sagaInitialize(connection, r => {
        r.register(ProfileStatusSaga);
      });
      //Arrange
      await startProfileSaga(services);
      await applyOtScoringReceived(services);
      const lcbFtUpdated = new LcbFtUpdated({
        type: 'string',
        eventDate: 'string',
        appUserId: uid,
        riskLevel: LcbFtRiskLevel.LOW,
      });

      //Act
      await services.dispatch(lcbFtUpdated);

      //Assert
      const [activeSaga] = await services.finder.findActiveSagasBySaga(ProfileStatusSaga);
      expect(activeSaga.instance.state.amlReceived).toBeTruthy();
      expect(activeSaga.instance.state.risk).toEqual(LcbFtRiskLevel.LOW);
    });
  });

  it('should update saga state when LcbFtUpdated event is received and status is CHECK_REQUIRED_AML', async () => {
    await scopeFactory(async connection => {
      const services = await sagaInitialize(connection, r => {
        r.register(ProfileStatusSaga);
      });
      //Arrange
      await startProfileSaga(services);
      await applyOtScoringReceived(services);
      await applyProfileStatusChanged(services, ProfileStatus.CHECK_REQUIRED_AML);
      const lcbFtUpdated = new LcbFtUpdated({
        type: 'string',
        eventDate: 'string',
        appUserId: uid,
        riskLevel: LcbFtRiskLevel.LOW,
      });
      lcbFtUpdated.metadata = { aggregate: 'profile', aggregateId: uid };

      //Act
      await services.dispatch(lcbFtUpdated);

      //Assert
      const [activeSaga] = await services.finder.findActiveSagasBySaga(ProfileStatusSaga);
      expect(activeSaga.instance.state.amlReceived).toBeTruthy();
      expect(activeSaga.instance.state.risk).toEqual(LcbFtRiskLevel.LOW);
    });
  });

  it('should update saga state when AccountEligibilityCalculated event is received', async () => {
    await scopeFactory(async connection => {
      const services = await sagaInitialize(connection, r => {
        r.register(ProfileStatusSaga);
      });
      //Arrange
      await startProfileSaga(services);
      await applyOtScoringReceived(services);
      const accountEligibilityCalculated = new AccountEligibilityCalculated({
        uId: uid,
        timestamp: new Date(),
        eligibility: true,
        balanceLimit: 1,
      });
      (accountEligibilityCalculated as DomainEvent).metadata = { aggregate: 'profile', aggregateId: uid };

      //Act
      await services.dispatch(accountEligibilityCalculated);

      //Assert
      const [activeSaga] = await services.finder.findActiveSagasBySaga(ProfileStatusSaga);
      expect(activeSaga.instance.state.eligibilityReceived).toBeTruthy();
      expect(activeSaga.instance.state.eligibility).toEqual({ accountEligibility: true });
    });
  });

  it('should update saga state when AccountEligibilityCalculated event is received and status is CHECK_ELIGIBILITY', async () => {
    await scopeFactory(async connection => {
      const services = await sagaInitialize(connection, r => {
        r.register(ProfileStatusSaga);
      });
      //Arrange
      await startProfileSaga(services);
      await applyOtScoringReceived(services);
      await applyProfileStatusChanged(services, ProfileStatus.CHECK_ELIGIBILITY);
      const accountEligibilityCalculated = new AccountEligibilityCalculated({
        uId: uid,
        timestamp: new Date(),
        eligibility: true,
        balanceLimit: 1,
      });
      (accountEligibilityCalculated as DomainEvent).metadata = { aggregate: 'profile', aggregateId: uid };

      //Act
      await services.dispatch(accountEligibilityCalculated);

      //Assert
      const [activeSaga] = await services.finder.findActiveSagasBySaga(ProfileStatusSaga);
      expect(activeSaga.instance.state.eligibilityReceived).toBeTruthy();
      expect(activeSaga.instance.state.eligibility).toEqual({ accountEligibility: true });
    });
  });

  it('should update saga state when BankAccountAggregated event is received', async () => {
    await scopeFactory(async connection => {
      const services = await sagaInitialize(connection, r => {
        r.register(ProfileStatusSaga);
      });
      //Arrange
      await startProfileSaga(services);
      await applyOtScoringReceived(services);
      const bankAccountAggregated = new BankAccountAggregated({
        userId: uid,
        isOwnerBankAccount: true,
      });

      //Act
      await services.dispatch(bankAccountAggregated);

      //Assert
      await services.checkActiveSagaCount(ProfileStatusSaga, 1);
    });
  });

  it('should update status when ProfileStatusChanged event is received', async () => {
    await scopeFactory(async connection => {
      const services = await sagaInitialize(connection, r => {
        r.register(ProfileStatusSaga);
      });
      //Arrange
      await startProfileSaga(services);
      const profileStatusChanged: DomainEvent = new ProfileStatusChanged({
        status: ProfileStatus.ACTION_REQUIRED_ID,
      });
      profileStatusChanged.metadata = { aggregate: 'profile', aggregateId: uid };

      //Act
      await services.dispatch(profileStatusChanged);

      //Assert
      const [activeSaga] = await services.finder.findActiveSagasBySaga(ProfileStatusSaga);
      expect(activeSaga.instance.state.status).toEqual(ProfileStatus.ACTION_REQUIRED_ID);
    });
  });

  it('should complete saga when ProfileActivated event is received', async () => {
    await scopeFactory(async connection => {
      const services = await sagaInitialize(connection, r => {
        r.register(ProfileStatusSaga);
      });
      //Arrange
      await startProfileSaga(services);
      const profileActivated: DomainEvent = new ProfileActivated({
        profileStatus: ProfileStatus.ACTIVE,
        activationType: undefined,
      });
      profileActivated.metadata = { aggregate: 'profile', aggregateId: uid };

      //Act
      await services.dispatch(profileActivated);

      //Assert
      const [activeSaga] = await services.finder.findActiveSagasBySaga(ProfileStatusSaga);
      expect(activeSaga).toBeUndefined();
    });
  });

  it('should complete saga when ProfileRejected event is received', async () => {
    await scopeFactory(async connection => {
      const services = await sagaInitialize(connection, r => {
        r.register(ProfileStatusSaga);
      });
      //Arrange
      await startProfileSaga(services);
      const profileRejected: DomainEvent = new ProfileRejected();
      profileRejected.metadata = { aggregate: 'profile', aggregateId: uid };

      //Act
      await services.dispatch(profileRejected);

      //Assert
      const [activeSaga] = await services.finder.findActiveSagasBySaga(ProfileStatusSaga);
      expect(activeSaga).toBeUndefined();
    });
  });

  const startProfileSaga = async (services, status: ProfileStatus = ProfileStatus.ON_BOARDING) => {
    const profileCreatedEvent = new ProfileCreated({
      uid: uid,
      email: email,
      steps: [],
      digitalIdentityId: digitalIdentityId,
      status: status,
    });
    profileCreatedEvent.metadata = { aggregate: 'profile', aggregateId: uid };

    await services.dispatch(profileCreatedEvent);
  };

  const applyOtScoringReceived = async services => {
    const otScoringUpdated = new OtScoringReceived({
      uid: uid,
      decision: KycDecisionType.OK,
      fraud: KycFraudType.RISK_LOW,
      compliance: KycDecisionType.OK,
      caseReference: '',
      caseId: 1,
      decisionScore: 1,
      sanctioned: KycDecisionType.OK,
      politicallyExposed: KycDecisionType.OK,
    });
    otScoringUpdated.metadata = { aggregate: 'profile', aggregateId: uid };
    await services.dispatch(otScoringUpdated);
  };

  const applyProfileStatusChanged = async (services, status: ProfileStatus = ProfileStatus.ON_HOLD) => {
    const profileStatusChanged = new ProfileStatusChanged({ status });
    profileStatusChanged.metadata = { aggregate: 'profile', aggregateId: uid };
    await services.dispatch(profileStatusChanged);
  };
});
