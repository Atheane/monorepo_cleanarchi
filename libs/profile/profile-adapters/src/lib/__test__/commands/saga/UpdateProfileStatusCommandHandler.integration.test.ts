import { jest } from '@jest/globals';
import { defaultLogger } from '@oney/logger-adapters';
import { Container } from 'inversify';
import { CoreTypes, QueryService } from '@oney/common-core';
import { buildProfileAdapterLib, ProfileGenerator } from '@oney/profile-adapters';
import { Identifiers } from '@oney/profile-core';
import { ProfileStatus, UpdateProfileStatusCommand } from '@oney/profile-messages';
import { UpdateProfileStatusCommandHandler } from '../../../adapters/commands/saga/UpdateProfileStatusCommandHandler';
import { config, identityConfig } from '../../fixtures/config';
import { MongodbProfile } from '../../../adapters/models/MongodbProfile';

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

describe('UpdateProfileStatusCommandHandler integration test', () => {
  const userId = 'beGe_flCm';
  const container = new Container();

  let queryService: QueryService;
  let profileGenerator: ProfileGenerator;

  beforeAll(async () => {
    await buildProfileAdapterLib(container, config, identityConfig);
    queryService = container.get(CoreTypes.queryService);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    profileGenerator = container.get(ProfileGenerator);
  });

  it('should update profile status', async () => {
    //Arrange
    await profileGenerator.generate(userId, ProfileStatus.ON_BOARDING);
    const handler = new UpdateProfileStatusCommandHandler(
      container.get(Identifiers.updateProfileStatus),
      defaultLogger,
    );
    const command = new UpdateProfileStatusCommand({
      uid: userId,
      status: ProfileStatus.ON_HOLD,
    });

    //Act
    await handler.handle(command);

    //Assert
    const result: MongodbProfile = await queryService.findOne({ uid: userId });
    expect(result.user_profile.status).toEqual(ProfileStatus.ON_HOLD);
  });
});
