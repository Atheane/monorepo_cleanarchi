import 'reflect-metadata';
import { EventDispatcher } from '@oney/messages-core';
import {
  ActivateProfileWithAggregation,
  GetUserInfos,
  Identifiers,
  Profile,
  ProfileErrors,
  ProfileRepositoryRead,
  ProfileRepositoryWrite,
} from '@oney/profile-core';
import { Container } from 'inversify';
import {
  BankAccountAggregatedEventHandler,
  buildProfileAdapterLib,
  ProfileGenerator,
} from '@oney/profile-adapters';
import MockDate from 'mockdate';
import { BankAccountAggregated } from '@oney/aggregation-messages';
import { defaultLogger } from '@oney/logger-adapters';
import { ProfileStatus } from '@oney/profile-messages';
import { config, identityConfig } from './fixtures/config';
import { activateDomainEvent } from './fixtures/activateProfile/events';

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

jest.mock('uuid', () => ({
  v4: () => 'uuid_v4_example',
}));

const container = new Container();

describe('Test suite for profile adapters', () => {
  let getUserInfos: GetUserInfos;
  let readRepository: ProfileRepositoryRead;
  let writeRepository: ProfileRepositoryWrite;
  let profileToActivate: Profile;
  let spyOn_dispatch;

  beforeAll(async () => {
    config.forceAzureServiceBus = true;
    await buildProfileAdapterLib(container, config, identityConfig);
    getUserInfos = container.get(GetUserInfos);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    const tipsDb = container.get(ProfileGenerator);
    readRepository = container.get<ProfileRepositoryRead>(Identifiers.profileRepositoryRead);
    writeRepository = container.get<ProfileRepositoryWrite>(Identifiers.profileRepositoryWrite);
    await tipsDb.generate('tata', ProfileStatus.ACTIVE);

    profileToActivate = await getUserInfos.execute({
      uid: 'tata',
    });
    profileToActivate.props.informations.status = ProfileStatus.ACTION_REQUIRED_ACTIVATE;
  });

  beforeEach(async () => {
    MockDate.set(new Date('2021-02-18T00:00:00.000Z'));

    const dispatcher = container.get(EventDispatcher);
    spyOn_dispatch = jest.spyOn(dispatcher, 'dispatch');
  });

  it('Should throw error cause profile not found', async () => {
    const result = getUserInfos.execute({
      uid: 'toto',
    });
    await expect(result).rejects.toThrow(ProfileErrors.ProfileNotFound);
  });

  it('Should retrieve a user profile', async () => {
    const result = await getUserInfos.execute({
      uid: 'tata',
    });
    expect(result.props.enabled).toBeTruthy();
    expect(result.props.informations.status).toEqual(ProfileStatus.ACTIVE);
  });

  it('Should retrieve a user profile based on its case reference', async () => {
    const profile = await getUserInfos.execute({
      uid: 'tata',
    });
    const result = await readRepository.getProfileByCaseReference(profile.props.kyc.caseReference);
    expect(result.props.uid).toEqual(profile.props.uid);
  });

  it('should activate profile when receiving diligence by aggregation success event', async () => {
    await writeRepository.save(profileToActivate);
    const handler = new BankAccountAggregatedEventHandler(
      container.get(ActivateProfileWithAggregation),
      defaultLogger,
    );
    const event: BankAccountAggregated = {
      id: 'poazkez',
      props: {
        userId: 'tata',
        isOwnerBankAccount: true,
      },
    };
    await handler.handle(event as any);
    const activatedProfile = await getUserInfos.execute({
      uid: 'tata',
    });
    await expect(activatedProfile.props.informations.status).toEqual(ProfileStatus.ACTIVE);
  });

  it('should not activate profile when receiving aggregation event and user not owner', async () => {
    await writeRepository.save(profileToActivate);
    const handler = new BankAccountAggregatedEventHandler(
      container.get(ActivateProfileWithAggregation),
      defaultLogger,
    );
    const event: BankAccountAggregated = {
      id: 'poazkez',
      props: {
        userId: 'tata',
        isOwnerBankAccount: false,
      },
    };
    await handler.handle(event as any);
    const activatedProfile = await getUserInfos.execute({
      uid: 'tata',
    });
    await expect(activatedProfile.props.informations.status).toEqual(
      profileToActivate.props.informations.status,
    );
  });

  it('should not activate profile when receiving aggregation event and user is not to activate', async () => {
    profileToActivate.props.informations.status = ProfileStatus.ACTION_REQUIRED_ID;
    await writeRepository.save(profileToActivate);
    const handler = new BankAccountAggregatedEventHandler(
      container.get(ActivateProfileWithAggregation),
      defaultLogger,
    );
    const event: BankAccountAggregated = {
      id: 'poazkez',
      props: {
        userId: 'tata',
        isOwnerBankAccount: true,
      },
    };
    await handler.handle(event as any);
    const activatedProfile = await getUserInfos.execute({
      uid: 'tata',
    });
    await expect(activatedProfile.props.informations.status).toEqual(
      profileToActivate.props.informations.status,
    );
    expect(spyOn_dispatch).toHaveBeenNthCalledWith(1, activateDomainEvent);
  });
});
