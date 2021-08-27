import 'reflect-metadata';
import './mocks/azureBus.mock';
import * as express from 'express';
import { Connection } from 'mongoose';
import { CreateMembership } from '@oney/subscription-messages';
import {
  EnrollSubscriber,
  SubscribeToOffer,
  SubscriptionIdentifier,
  SubscriptionRepository,
} from '@oney/subscription-core';
import * as nock from 'nock';
import * as request from 'supertest';
import { EncodeIdentity, IdentityProvider } from '@oney/identity-core';
import { EventDispatcher } from '@oney/messages-core';
import * as path from 'path';
import { events, mockedSagaState } from './fixtures/createMembershipInsurance';
import { bootstrap } from '../config/bootstrap';
import { sagaInitialize } from '../config/sagaInitialize';
import { CreateMembershipInsuranceSagas } from '../../modules/insurance/sagas/CreateMembershipInsuranceSagas';
import { CreateMembershipHandler } from '../../modules/insurance/handlers/CreateMembershipHandler';
import { SubscriptionKernel } from '../../config/di/SubscriptionKernel';

jest.mock('uuid', () => ({
  v4: () => 'theSubscriptionID',
}));

const app = express();

describe('Create Membership Insurance integration testing', () => {
  let container: SubscriptionKernel;
  let services;
  let saveFixture;
  const dispatchSpy = jest.spyOn(EventDispatcher.prototype, 'dispatch');
  const userId = events.profileCreated.props.uid;
  Object.entries(events).map(event => {
    event[1]['metadata'] = {
      aggregateId: userId,
    };
  });

  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/../env/test.env');
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures`);
    nock.back.setMode('record');
    const { nockDone } = await nock.back('getAccessToken.json');
    container = await bootstrap(app, envPath, process.env.MONGO_URL, true);
    nockDone();
    services = await sagaInitialize(
      container.get(Connection),
      r => {
        r.register(CreateMembershipInsuranceSagas);
      },
      container,
    );
  });

  beforeEach(async () => {
    nock.restore();
    nock.activate();
    const { nockDone } = await nock.back(test.getFixtureName());
    saveFixture = nockDone;
    nock.enableNetConnect(/127\.0\.0\.1/);
  });

  afterEach(() => {
    const nockObjects = nock.recorder.play();
    if (nockObjects.length == 0) {
      nock.restore();
    } else {
      console.log('saving nock fixture for: ', test.getFixtureName());
      saveFixture();
    }
  });

  it('Should have a complete state before saga completion', async () => {
    let sagaState;
    // Handle ProfileCreated Event
    await services.dispatch(events.profileCreated);
    const sagaStateProfileCreated = await services.getAllActiveSagaBySaga(CreateMembershipInsuranceSagas);
    sagaState = {
      instanceId: sagaStateProfileCreated[0].instance.state.instanceId,
      subscriberId: events.profileCreated.props.uid,
      profile: {
        honorificCode: null,
        firstName: null,
        legalName: null,
        birthDate: null,
        email: events.profileCreated.props.email,
        phone: null,
        address: null,
      },
    };
    expect(sagaStateProfileCreated[0].instance.state).toEqual(sagaState);

    // Handle PhoneStepValidated Event
    await services.dispatch(events.phoneStepValidated);
    const sagaStatePhone = await services.getAllActiveSagaBySaga(CreateMembershipInsuranceSagas);
    sagaState = {
      ...sagaState,
      instanceId: sagaStatePhone[0].instance.state.instanceId,
      profile: {
        ...sagaState.profile,
        ...events.phoneStepValidated.props,
      },
    };
    expect(sagaStatePhone[0].instance.state).toEqual(sagaState);

    // Handle CiviLStatusStepValidated Event
    await services.dispatch(events.civilStatusValidated);
    const sagaStateCivilStatus = await services.getAllActiveSagaBySaga(CreateMembershipInsuranceSagas);
    sagaState = {
      ...sagaState,
      instanceId: sagaStateCivilStatus[0].instance.state.instanceId,
      profile: {
        ...sagaState.profile,
        honorificCode: events.civilStatusValidated.props.honorificCode,
        firstName: events.civilStatusValidated.props.firstName,
        legalName: events.civilStatusValidated.props.legalName,
        birthDate: events.civilStatusValidated.props.birthDate,
      },
    };
    expect(sagaStateCivilStatus[0].instance.state).toEqual(sagaState);

    // Handle CiviLStatusStepValidated Event
    await services.dispatch(events.civilStatusValidatedJustBirthName);
    const sagaStateCivilStatusBirthName = await services.getAllActiveSagaBySaga(
      CreateMembershipInsuranceSagas,
    );
    sagaState = {
      ...sagaState,
      instanceId: sagaStateCivilStatus[0].instance.state.instanceId,
      profile: {
        ...sagaState.profile,
        honorificCode: events.civilStatusValidated.props.honorificCode,
        firstName: events.civilStatusValidated.props.firstName,
        legalName: events.civilStatusValidated.props.birthName,
        birthDate: events.civilStatusValidated.props.birthDate,
      },
    };
    expect(sagaStateCivilStatusBirthName[0].instance.state).toEqual(sagaState);

    // Handle AddressStepValidated Event
    await services.dispatch(events.addressValidated);
    const sagaStateAddress = await services.getAllActiveSagaBySaga(CreateMembershipInsuranceSagas);
    sagaState = {
      ...sagaState,
      instanceId: sagaStateAddress[0].instance.state.instanceId,
      profile: {
        ...sagaState.profile,
        address: events.addressValidated.props,
      },
    };
    expect(sagaStateAddress[0].instance.state).toEqual(sagaState);

    // Handle BankAccountOpened Event
    await services.dispatch(events.bankAccountOpened);
    const sagaStateBankAccount = await services.getAllActiveSagaBySaga(CreateMembershipInsuranceSagas);
    sagaState = {
      ...sagaState,
      instanceId: sagaStateBankAccount[0].instance.state.instanceId,
      bankAccountInfo: {
        iban: events.bankAccountOpened.props.iban,
        bic: events.bankAccountOpened.props.bic,
      },
    };
    expect(sagaStateBankAccount[0].instance.state).toEqual(sagaState);

    // Handle CardCreated Event
    await services.dispatch(events.cardCreated);
    const sagaStateCardCreated = await services.getAllActiveSagaBySaga(CreateMembershipInsuranceSagas);
    sagaState = {
      ...sagaState,
      instanceId: sagaStateCardCreated[0].instance.state.instanceId,
      creditCardInfo: {
        pan: events.cardCreated.props.pan,
      },
    };
    expect(sagaStateCardCreated[0].instance.state).toEqual(sagaState);

    // Handle SubscriptionActivated Event
    await services.dispatch(events.subscriptionActivated);
    const completedSaga = await services.getAllActiveSagaBySaga(CreateMembershipInsuranceSagas);
    expect(completedSaga.length).toEqual(0);
    expect(dispatchSpy).toHaveBeenLastCalledWith(
      new CreateMembership({
        subscriptionId: events.subscriptionActivated.metadata.aggregateId,
        profileInfo: sagaState.profile,
        bankAccountInfo: sagaState.bankAccountInfo,
        creditCardInfo: sagaState.creditCardInfo,
      }),
    );
  });

  it('Should handle complete saga state and then create insurance membership', async () => {
    // Setup a test subscription
    await container.get(EnrollSubscriber).execute({
      uid: userId,
    });
    await container.get(SubscribeToOffer).execute({
      subscriberId: userId,
      offerId: 'c7cf068d-77ae-46b0-bf1f-afd938f4fc85',
    });

    // Handle command sent by Saga
    await container.resolve(CreateMembershipHandler).handle(
      new CreateMembership({
        subscriptionId: mockedSagaState.subscriptionId,
        profileInfo: mockedSagaState.profile,
        bankAccountInfo: mockedSagaState.bankAccountInfo,
        creditCardInfo: mockedSagaState.creditCardInfo,
      }),
    );

    // Check in DB if subscription has been updated
    const savedSubscription = await container
      .get<SubscriptionRepository>(SubscriptionIdentifier.subscriptionRepository)
      .getById(mockedSagaState.subscriptionId);
    expect(savedSubscription.props.insuranceMembershipId).toBeDefined();

    // Check if the subscription is updated
    const token = await container.get(EncodeIdentity).execute({
      uid: userId,
      email: 'john.doe@email.fr',
      providerId: null,
      provider: IdentityProvider.odb,
    });
    await request(app)
      .get('/subscription/' + userId)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(resp => {
        expect(resp.body[0].insuranceMembershipId).toBeDefined();
      });
  });
});
