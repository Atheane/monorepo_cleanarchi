import 'reflect-metadata';
import { GenericError } from '@oney/common-core';
import {
  FacematchResult,
  Identifiers,
  Profile,
  ProfileRepositoryRead,
  Steps,
  ValidateFacematch,
} from '@oney/profile-core';
import { Container } from 'inversify';
import * as nock from 'nock';
import { ProfileStatus } from '@oney/profile-messages';
import { config, identityConfig } from './fixtures/config';
import { facematchRequest } from './fixtures/oneytrust/facematch';
import { ProfileGenerator } from './fixtures/tips/ProfileGenerator';
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

describe('Facematch unit testing', function () {
  let validateFacematch: ValidateFacematch;
  let profileRepositoryRead: ProfileRepositoryRead;
  let scope: nock.Scope;

  beforeAll(async () => {
    config.forceAzureServiceBus = true;
    await buildProfileAdapterLib(container, config, identityConfig);
    validateFacematch = container.get(ValidateFacematch);
    profileRepositoryRead = container.get<ProfileRepositoryRead>(Identifiers.profileRepositoryRead);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    const tipsDb = container.get(ProfileGenerator);
    await tipsDb.generate('ttfacematch', ProfileStatus.ACTIVE);
  });

  beforeEach(async () => {
    nock.cleanAll();
  });

  it('Should return an updated profile', async () => {
    // GIVEN
    scope = nock('https://test');
    scope.post('/selfieoutcome').reply(204);

    const profile = await profileRepositoryRead.getUserById(facematchRequest.uid);

    // WHEN
    const updatedProfile = await validateFacematch.execute(facematchRequest);

    // THEN
    expect(updatedProfile).toMatchObject({
      ...profile,
      props: {
        ...profile.props,
        kyc: {
          ...profile.props.kyc,
          steps: [
            Steps.PHONE_STEP,
            Steps.SELECT_OFFER_STEP,
            Steps.IDENTITY_DOCUMENT_STEP,
            Steps.ADDRESS_STEP,
            Steps.CIVIL_STATUS_STEP,
            Steps.FISCAL_STATUS_STEP,
            Steps.CONTRACT_STEP,
          ],
        },
      },
    } as Profile);
  });

  it('Should fail to update profile', async () => {
    // GIVEN
    scope = nock('https://test');
    scope.post('/selfieoutcome').reply(400);

    const error = new GenericError.ApiResponseError('ONEYTRUST_API_ERROR');

    // WHEN
    const updatedProfile = validateFacematch.execute({
      ...facematchRequest,
      result: FacematchResult.SKIPPED,
    });

    // THEN
    await expect(updatedProfile).rejects.toThrow(error);
  });
});
