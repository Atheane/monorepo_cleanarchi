import { CollectDebt } from '@oney/payment-core';
import { SymLogger } from '@oney/logger-core';
import * as nock from 'nock';
import * as path from 'path';
import 'reflect-metadata';
import {
  DebtsCollectionOrderedEventMocked,
  DebtsCollectionOrderedEventPropsMocked,
} from './fixtures/debt/debtsCollectionOrderedHandlerEvent';
import { initializePaymentKernel } from './fixtures/initializePaymentKernel';
import { DebtsCollectionOrderedHandler } from '../adapters/handlers/debt/DebtsCollectionOrderedHandler';
import { PaymentKernel } from '../di/PaymentKernel';

nock.enableNetConnect();
nock.cleanAll();

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
        getBlobClient: jest.fn().mockReturnValue({}),
      }),
    }),
  },
}));

describe('DebtsCollectionOrderedHandler trigger', () => {
  let kernel: PaymentKernel;

  beforeAll(async () => {
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/debtsCollecHandler`);
    nock.back.setMode('record');
    const { nockDone } = await nock.back('getAccessToken.json');

    kernel = await initializePaymentKernel({ useAzure: true });

    nockDone();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('should execute CollectDebt usecase', async () => {
    const collectDebtUsecaseSpy = (CollectDebt.prototype.execute = jest.fn());
    const expectedUseCaseCalledWithParameters = expect.objectContaining({
      amount: DebtsCollectionOrderedEventPropsMocked.amount,
      uid: DebtsCollectionOrderedEventPropsMocked.uid,
    });

    const debtsCollectionOrderedHandler = new DebtsCollectionOrderedHandler(
      kernel.get(CollectDebt),
      kernel.get(SymLogger),
    );

    await debtsCollectionOrderedHandler.handle(DebtsCollectionOrderedEventMocked);

    expect(collectDebtUsecaseSpy).toBeCalledWith(expectedUseCaseCalledWithParameters);
  });
});
