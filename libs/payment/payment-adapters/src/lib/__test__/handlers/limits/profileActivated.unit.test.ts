import {
  ProfileStatus,
  ProfileActivated,
  ProfileActivatedProps,
  ProfileActivationType,
} from '@oney/profile-messages';
import {
  ApplyLocalLimits,
  ApplyLocalLimitsCommand,
  BankAccountRepositoryWrite,
  PaymentIdentifier,
} from '@oney/payment-core';
import { PaymentKernel } from '@oney/payment-adapters';
import * as nock from 'nock';
import { defaultLogger } from '@oney/logger-adapters';
import * as path from 'path';
import { ProfileActivatedEventHandler } from '../../../adapters/handlers/limits/ProfileActivatedEventHandler';
import { initializePaymentKernel } from '../../fixtures/initializePaymentKernel';
import { mockedLimitedBankAccount } from '../../fixtures/smoneyUser/createBankAccountMock';

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

jest.mock('@azure/storage-blob', () => ({
  BlobServiceClient: {
    fromConnectionString: jest.fn().mockReturnValue({
      getContainerClient: jest.fn().mockReturnValue({
        listBlobsFlat: jest.fn().mockReturnValue([
          {
            name: 'kyc/toto.jpg',
          },
        ]),
        getBlobClient: jest.fn().mockReturnValue({
          download: jest.fn().mockReturnValue({
            readableStreamBody: Buffer.from(''),
          }),
        }),
      }),
    }),
  },
}));

describe('test ProfileActivatedEventHandler', () => {
  let kernel: PaymentKernel;

  beforeAll(async () => {
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/profileActivated`);
    nock.back.setMode('record');
    const { nockDone } = await nock.back('getAccessToken.json');

    kernel = await initializePaymentKernel({ useAzure: true });

    await kernel.initSubscribers();
    nockDone();
  });

  it('should use the appropriate command', async () => {
    // creating a bankAccount inmemory
    const { nockDone } = await nock.back('getAccessTokenInMemory.json');
    await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(mockedLimitedBankAccount);
    nockDone();

    const props: ProfileActivatedProps = {
      profileStatus: ProfileStatus.ACTIVE,
      activationType: ProfileActivationType.AGGREGATION,
    };
    const metadata = {
      aggregateId: mockedLimitedBankAccount.props.uid,
      type: 'test',
      eventName: 'PROFILE_ACTIVATED',
      aggregate: 'test',
      boundedContext: 'profile',
      version: 1,
    };
    const event = new ProfileActivated(props, metadata);

    // mock eventHandler dependency
    const spy = (ApplyLocalLimits.prototype.execute = jest.fn());

    const handlersUseCase = kernel.get(ApplyLocalLimits);
    const handler = new ProfileActivatedEventHandler(handlersUseCase, defaultLogger);
    await handler.handle(event);

    const expectedCommand: ApplyLocalLimitsCommand = {
      uid: metadata.aggregateId,
    };
    expect(spy).toHaveBeenCalledWith(expectedCommand);

    spy.mockReset();
  });

  it('should NOT execute usecase', async () => {
    // creating a bankAccount inmemory
    await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(mockedLimitedBankAccount);

    const props: ProfileActivatedProps = {
      profileStatus: ProfileStatus.ON_BOARDING,
      activationType: ProfileActivationType.AGGREGATION,
    };
    const metadata = {
      aggregateId: mockedLimitedBankAccount.props.uid,
      type: 'test',
      eventName: 'PROFILE_ACTIVATED',
      aggregate: 'test',
      boundedContext: 'profile',
      version: 1,
    };
    const event = new ProfileActivated(props, metadata);

    // mock eventHandler dependency
    const spy = (ApplyLocalLimits.prototype.execute = jest.fn());

    const handlersUseCase = kernel.get(ApplyLocalLimits);
    const handler = new ProfileActivatedEventHandler(handlersUseCase, defaultLogger);
    await handler.handle(event);

    const expectedCommand: ApplyLocalLimitsCommand = {
      uid: metadata.aggregateId,
    };
    expect(spy).not.toHaveBeenCalledWith(expectedCommand);

    spy.mockReset();
  });
});
