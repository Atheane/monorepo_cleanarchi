import 'reflect-metadata';
import {
  CalculateBankAccountExposure,
  UpdateSplitPaymentEligibility,
  UpdateSplitPaymentEligibilityCommand,
} from '@oney/payment-core';
import { defaultLogger } from '@oney/logger-adapters';
import * as nock from 'nock';
import * as path from 'path';
import { initializePaymentKernel } from './fixtures/initializePaymentKernel';
import {
  X3X4EligibilityCalculatedEventMocked,
  X3X4EligibilityCalculatedEventPropsMocked,
} from './fixtures/updateSplitPaymentElibility/SplitPaymentEligibilityCalculatedEventMocked';
import { PaymentKernel } from '../di/PaymentKernel';
import { SplitPaymentEligibilityCalcultedEventHandler } from '../adapters/handlers/cdp/SplitPaymentEligibilityCalcultedEventHandler';

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

describe('SplitPaymentEligibilityCalcultedEventHandler trigger', () => {
  let kernel: PaymentKernel;

  beforeAll(async () => {
    nock.enableNetConnect();
    nock.cleanAll();
    nock.restore();

    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/splitEligibilityHandler`);
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

  it('should execute UpdateSplitPaymentEligibility usecase', async () => {
    const updateBankAccountEligibilityToSplitPaymentSpy = (UpdateSplitPaymentEligibility.prototype.execute = jest.fn());
    const calculateBankAccountExposureSpy = (CalculateBankAccountExposure.prototype.execute = jest.fn());

    const expectedUseCaseCalledWithParameters: UpdateSplitPaymentEligibilityCommand = {
      splitPaymentEligibility: X3X4EligibilityCalculatedEventPropsMocked.eligibility,
      uid: X3X4EligibilityCalculatedEventPropsMocked.uId,
    };
    const splitPaymentEligibilityCalcultedEventHandler = new SplitPaymentEligibilityCalcultedEventHandler(
      kernel.get(UpdateSplitPaymentEligibility),
      kernel.get(CalculateBankAccountExposure),
      defaultLogger,
    );

    await splitPaymentEligibilityCalcultedEventHandler.handle(X3X4EligibilityCalculatedEventMocked);

    expect(updateBankAccountEligibilityToSplitPaymentSpy).toBeCalledWith(expectedUseCaseCalledWithParameters);
    expect(calculateBankAccountExposureSpy).toBeCalled();
  });
});
