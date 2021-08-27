import 'reflect-metadata';
import { UpdateTechnicalLimit, UpdateTechnicalLimitCommand } from '@oney/payment-core';
import { SymLogger } from '@oney/logger-core';
import * as nock from 'nock';
import * as path from 'path';
import { initializePaymentKernel } from './fixtures/initializePaymentKernel';
import {
  SplitPaymentScheduleCreatedMocked,
  SplitPaymentScheduleCreatedPropsMocked,
} from './fixtures/SplitContractCreatedEventHandler/splitContractCreatedEvent.fixture';
import { SplitPaymentScheduleCreatedEventHandler } from '../adapters/handlers/splitPayments/SplitPaymentScheduleCreatedEventHandler';
import { PaymentKernel } from '../di/PaymentKernel';

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

describe('SplitPaymentScheduleCreatedEventHandler trigger', () => {
  let kernel: PaymentKernel;

  beforeAll(async () => {
    nock.enableNetConnect();
    nock.cleanAll();
    nock.restore();

    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/splitSchedule`);
    nock.back.setMode('record');
    const { nockDone } = await nock.back('getAccessToken.json');

    kernel = await initializePaymentKernel({ useAzure: true });

    nockDone();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('should execute UpdateTechnicalLimit usecase', async () => {
    const usecaseSpyOn = (UpdateTechnicalLimit.prototype.execute = jest.fn());
    const expectedUseCaseCalledWithParameters: UpdateTechnicalLimitCommand = {
      uid: SplitPaymentScheduleCreatedPropsMocked.userId,
      useContract: true,
      contract: {
        fees: 0.22,
        firstPayment: 5,
        funding: 15,
      },
    };
    const handlerToTest = new SplitPaymentScheduleCreatedEventHandler(
      kernel.get(UpdateTechnicalLimit),
      kernel.get(SymLogger),
    );

    await handlerToTest.handle(SplitPaymentScheduleCreatedMocked);

    expect(usecaseSpyOn).toBeCalledWith(expectedUseCaseCalledWithParameters);
  });
});
