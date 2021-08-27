import 'reflect-metadata';
import { CreateProfile, Steps } from '@oney/profile-core';
import { Container } from 'inversify';
import * as nock from 'nock';
import { GenericError } from '@oney/common-core';
import { ProfileStatus } from '@oney/profile-messages';
import * as path from 'path';
import { config, identityConfig } from './fixtures/config';
import { buildProfileAdapterLib } from '../adapters/build';

const container = new Container();

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
const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures/createProfile`);
nockBack.setMode('record');

const stepOrder = JSON.stringify([
  Steps.PHONE_STEP,
  Steps.SELECT_OFFER_STEP,
  Steps.IDENTITY_DOCUMENT_STEP,
  Steps.CIVIL_STATUS_STEP,
  Steps.FACEMATCH_STEP,
  Steps.ADDRESS_STEP,
  Steps.FISCAL_STATUS_STEP,
  Steps.CONTRACT_STEP,
]);

describe('Create Profile unit testing', function () {
  beforeAll(async () => {
    config.forceAzureServiceBus = true;
    await buildProfileAdapterLib(container, config, identityConfig);
  });

  beforeEach(async () => {
    nock.cleanAll();
  });

  it('Should create a profile with digital identity already registered', async () => {
    const { nockDone } = await nockBack('createProfileWithDigitalIdentityAlreadyRegistered.json');

    const result = await container.get(CreateProfile).execute({
      uid: 'hello',
      email: 'nacimiphone8@yopmail.com',
    });
    expect(JSON.stringify(result.props.kyc.steps)).toEqual(stepOrder);
    expect(result.props.digitalIdentityId).toBeTruthy();
    await nockDone();
  });

  it('Should create a profile with phone provided', async () => {
    const { nockDone } = await nockBack('createProfileWithDigitalIdentityAlreadyRegistered.json');

    const result = await container.get(CreateProfile).execute({
      uid: 'hello',
      email: 'nacimiphone8@yopmail.com',
      phone: '33584875654',
    });
    expect(JSON.stringify(result.props.kyc.steps)).toEqual(stepOrder);
    expect(result.props.digitalIdentityId).toBeTruthy();
    expect(result.props.informations.phone).toEqual('33584875654');
    await nockDone();
  });

  it('Should create a profile with digital identity and phone already registered', async () => {
    const { nockDone } = await nockBack('createProfileWithPhoneAlreadySetted.json');

    const result = await container.get(CreateProfile).execute({
      uid: 'hello',
      email: 'nacimiphone8@yopmail.com',
    });
    expect(result.props.informations.phone).toBeTruthy();
    expect(JSON.stringify(result.props.kyc.steps)).toEqual(stepOrder);
    expect(result.props.digitalIdentityId).toBeTruthy();
    expect(result.props.informations.status).toEqual(ProfileStatus.ON_BOARDING);
    await nockDone();
  });

  it('Should create a profile and create a digital identity for user', async () => {
    const { nockDone } = await nockBack('createProfileWithDigitalIdentityNotFound.json');
    const result = await container.get(CreateProfile).execute({
      uid: 'hello',
      email: 'IdentityNotFound@yopmail.com',
    });
    expect(JSON.stringify(result.props.kyc.steps)).toEqual(stepOrder);
    expect(result.props.digitalIdentityId).toBeTruthy();
    expect(result.props.informations.status).toEqual(ProfileStatus.ON_BOARDING);
    await nockDone();
  });

  it('Should not save Profile cause error Occured on OneyB2C Get Digital Identity', async () => {
    const { nockDone } = await nockBack('errorOnDigitalIdentity.json');
    container.unbindAll();
    await buildProfileAdapterLib(
      container,
      {
        ...config,
        providersConfig: {
          ...config.providersConfig,
          oneyB2CConfig: {
            ...config.providersConfig.oneyB2CConfig,
            OdbOneyB2CApiXAuthAuthent: 'iamabadconfiguration',
          },
        },
      },
      identityConfig,
    );
    const result = container.get(CreateProfile).execute({
      uid: 'hello',
      email: 'digitalIdentityNotFound@yopmail.com',
    });
    await expect(result).rejects.toThrow(GenericError.ApiResponseError);
    await nockDone();
  });
});
