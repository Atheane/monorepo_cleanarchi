import 'reflect-metadata';
import { defaultLogger } from '@oney/logger-adapters';
import { CalculateBankAccountExposure, OrderDebtsCollection } from '@oney/payment-core';
import * as nock from 'nock';
import * as path from 'path';
import { initializePaymentKernel } from './fixtures/initializePaymentKernel';
import {
  SctInReceiveEventMocked,
  spectedDebtCollectionUsecaseParametersReceived,
} from './fixtures/transactions/sctInReceiveHandlerEvent';
import { SctInReceivedHandler } from '../adapters/handlers/transaction/SctInReceivedHandler';
import { PaymentKernel } from '../di/PaymentKernel';
import { SmoneyCurrencyUnitMapper } from '../adapters/mappers/SmoneyCurrencyUnitMapper';

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

describe('SctInReceiveHandler for debts collection', () => {
  let kernel: PaymentKernel;

  beforeAll(async () => {
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/sctInReceived`);
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

  it('should execute OrderDebtsCollection usecase', async () => {
    const orderDebtsCollectionUsecaseSpy = (OrderDebtsCollection.prototype.execute = jest.fn());
    CalculateBankAccountExposure.prototype.execute = jest.fn();
    const sctInReceivedHandler = new SctInReceivedHandler(
      kernel.get(OrderDebtsCollection),
      kernel.get(CalculateBankAccountExposure),
      kernel.get(SmoneyCurrencyUnitMapper),
      defaultLogger,
    );

    await sctInReceivedHandler.handle(SctInReceiveEventMocked);

    expect(orderDebtsCollectionUsecaseSpy).toBeCalledWith(
      expect.objectContaining(spectedDebtCollectionUsecaseParametersReceived),
    );
  });
});
