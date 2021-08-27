import { buildProfileAdapterLib, ProfileGenerator } from '@oney/profile-adapters';
import { Identifiers, UpdateConsents, ProfileRepositoryRead } from '@oney/profile-core';
import { Container } from 'inversify';
import * as nock from 'nock';
import { ServiceBusClient } from '@azure/service-bus';
import MockDate from 'mockdate';
import * as path from 'path';
import { config, identityConfig } from './fixtures/config';
import {
  consentWithAllFieldsEvent,
  consentWithAllFieldsFalseEvent,
  consentWithoutAllFieldsEvent,
} from './fixtures/updateConsents/events';

const container = new Container();

jest.mock('uuid', () => ({
  v4: () => 'uuid_v4_example',
}));

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

describe('UpdateConsents unit testing', () => {
  const uid = 'AWzclPFyN';

  let updateConsents: UpdateConsents;
  let profileRepositoryRead: ProfileRepositoryRead;

  let saveFixture: Function;
  let mockBusSend: jest.Mock;

  beforeAll(async () => {
    mockBusSend = (ServiceBusClient.createFromConnectionString(null).createTopicClient(null).createSender()
      .send as unknown) as jest.Mock;

    config.forceAzureServiceBus = true;
    await buildProfileAdapterLib(container, config, identityConfig);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    const profileDb = container.get(ProfileGenerator);
    updateConsents = container.get(UpdateConsents);
    profileRepositoryRead = container.get<ProfileRepositoryRead>(Identifiers.profileRepositoryRead);
    await profileDb.getProfileWithConsent(uid, 'ozzj@yopmail.com');

    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/updateConsents`);
    nock.back.setMode('record');
  });

  beforeEach(async () => {
    MockDate.set(new Date('2021-04-01T00:00:00.000Z'));
    mockBusSend.mockClear();
    nock.restore();
    nock.activate();
    const { nockDone } = await nock.back(test.getFixtureName());
    saveFixture = nockDone;
  });

  afterEach(() => {
    MockDate.reset();
    const nockObjects = nock.recorder.play();
    if (nockObjects.length == 0) {
      nock.restore();
    } else {
      console.log('saving nock fixture for: ', test.getFixtureName());
      saveFixture();
    }
  });

  it('Should update consent with all the fields', async () => {
    const consentsToUpdate = {
      oney: {
        cnil: true,
        len: true,
      },
      partners: {
        cnil: true,
        len: true,
      },
    };
    await updateConsents.execute({
      uid,
      consents: consentsToUpdate,
    });

    const updatedProfile = await profileRepositoryRead.getUserById(uid);
    expect(updatedProfile.props.consents).toEqual(consentsToUpdate);
    expect(mockBusSend).toHaveBeenCalledWith(consentWithAllFieldsEvent);
  });

  it('Should update consent without optional the fields', async () => {
    const consentsToUpdate = {
      oney: {
        cnil: true,
      },
      partners: {
        cnil: true,
      },
    };
    await updateConsents.execute({
      uid,
      consents: consentsToUpdate,
    });

    const updatedProfile = await profileRepositoryRead.getUserById(uid);
    expect(updatedProfile.props.consents).toEqual(consentsToUpdate);
    expect(mockBusSend).toHaveBeenCalledWith(consentWithoutAllFieldsEvent);
  });

  it('Should update consent with all the fields set at false', async () => {
    const consentsToUpdate = {
      oney: {
        cnil: false,
        len: false,
      },
      partners: {
        cnil: false,
        len: false,
      },
    };
    await updateConsents.execute({
      uid,
      consents: consentsToUpdate,
    });

    const updatedProfile = await profileRepositoryRead.getUserById(uid);
    expect(updatedProfile.props.consents).toEqual(consentsToUpdate);
    expect(mockBusSend).toHaveBeenCalledWith(consentWithAllFieldsFalseEvent);
  });
});
