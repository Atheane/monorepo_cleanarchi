import { buildProfileAdapterLib, ProfileGenerator } from '@oney/profile-adapters';
import { Container } from 'inversify';
import { CoreTypes, QueryService } from '@oney/common-core';
import { Identifiers } from '@oney/profile-core';
import { AccountEligibilityCalculated } from '@oney/cdp-messages';
import { jest } from '@jest/globals';
import { defaultLogger } from '@oney/logger-adapters';
import { ProfileStatus } from '@oney/profile-messages';
import { ServiceBusClient } from '@azure/service-bus';
import { AccountEligibilityCalculatedEventHandler } from '../../adapters/events/cdp/AccountEligibilityCalculatedEventHandler';
import { config, identityConfig } from '../fixtures/config';
import { MongodbProfile } from '../../adapters/models/MongodbProfile';

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

describe('AccountEligibilityCalculatedEventHandler unit test', () => {
  const userId = 'MnDqtMQrm';
  const container = new Container();

  let queryService: QueryService;
  let profileGenerator: ProfileGenerator;
  let mockBusSend: jest.Mock;

  beforeAll(async () => {
    await buildProfileAdapterLib(container, config, identityConfig);
    mockBusSend = (ServiceBusClient.createFromConnectionString(null).createTopicClient(null).createSender()
      .send as unknown) as jest.Mock;
    queryService = container.get(CoreTypes.queryService);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    profileGenerator = container.get(ProfileGenerator);
  });

  beforeEach(() => {
    mockBusSend.mockClear();
  });

  it('should update profile with new eligibility from CDP domain event', async () => {
    //Arrange
    await profileGenerator.generate(userId, ProfileStatus.CHECK_ELIGIBILITY);
    const handler = new AccountEligibilityCalculatedEventHandler(
      container.get(Identifiers.updateProfileEligibility),
      defaultLogger,
    );
    const domainEvent: AccountEligibilityCalculated = new AccountEligibilityCalculated({
      uId: userId,
      timestamp: new Date(),
      eligibility: true,
      balanceLimit: 1,
    });

    //Act
    await handler.handle(domainEvent);

    //Assert
    const result: MongodbProfile = await queryService.findOne({ uid: userId });
    expect(result.kyc.eligibility).toEqual({ accountEligibility: true });
    expect(result.user_profile.status).toEqual('actionRequiredActivate');
  });

  it('should not update profile status when current status is not CHECK_ELIGIBILITY', async () => {
    //Arrange
    await profileGenerator.generate(userId, ProfileStatus.ON_HOLD);
    const handler = new AccountEligibilityCalculatedEventHandler(
      container.get(Identifiers.updateProfileEligibility),
      defaultLogger,
    );
    const domainEvent: AccountEligibilityCalculated = new AccountEligibilityCalculated({
      uId: userId,
      timestamp: new Date(),
      eligibility: true,
      balanceLimit: 1,
    });

    //Act
    await handler.handle(domainEvent);

    //Assert
    const result: MongodbProfile = await queryService.findOne({ uid: userId });
    expect(result.kyc.eligibility).toEqual({ accountEligibility: true });
    expect(result.user_profile.status).toEqual('onHold');
  });
});

describe('AccountEligibilityCalculatedEventHandler unit test with saga', () => {
  const userId = 'MnDqtMQrm';
  const container = new Container();

  let queryService: QueryService;
  let profileGenerator: ProfileGenerator;
  let mockBusSend: jest.Mock;

  beforeAll(async () => {
    await buildProfileAdapterLib(
      container,
      {
        ...config,
        featureFlag: { profileStatusSaga: true },
      },
      identityConfig,
    );
    mockBusSend = (ServiceBusClient.createFromConnectionString(null).createTopicClient(null).createSender()
      .send as unknown) as jest.Mock;
    queryService = container.get(CoreTypes.queryService);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    profileGenerator = container.get(ProfileGenerator);
  });

  beforeEach(() => {
    mockBusSend.mockClear();
  });

  it('should update profile with new eligibility from CDP domain event', async () => {
    //Arrange
    await profileGenerator.generate(userId, ProfileStatus.ON_BOARDING);
    const handler = new AccountEligibilityCalculatedEventHandler(
      container.get(Identifiers.updateProfileEligibility),
      defaultLogger,
    );
    const domainEvent: AccountEligibilityCalculated = new AccountEligibilityCalculated({
      uId: userId,
      timestamp: new Date(),
      eligibility: true,
      balanceLimit: 1,
    });

    //Act
    await handler.handle(domainEvent);

    //Assert
    const result: MongodbProfile = await queryService.findOne({ uid: userId });
    expect(result.kyc.eligibility).toEqual({ accountEligibility: true });
  });

  it('should not update profile status', async () => {
    //Arrange
    await profileGenerator.generate(userId, ProfileStatus.ON_BOARDING);
    const handler = new AccountEligibilityCalculatedEventHandler(
      container.get(Identifiers.updateProfileEligibility),
      defaultLogger,
    );
    const domainEvent: AccountEligibilityCalculated = new AccountEligibilityCalculated({
      uId: userId,
      timestamp: new Date(),
      eligibility: true,
      balanceLimit: 1,
    });

    //Act
    await handler.handle(domainEvent);

    //Assert
    const result: MongodbProfile = await queryService.findOne({ uid: userId });
    expect(result.user_profile.status).toEqual('onBoarding');
    expect(mockBusSend).not.toHaveBeenCalled();
  });
});
