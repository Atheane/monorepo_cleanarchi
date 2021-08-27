import {
  BankAccountRepositoryWrite,
  InitiateLimits,
  InitiateLimitsCommand,
  PaymentIdentifier,
} from '@oney/payment-core';
import { PaymentKernel } from '@oney/payment-adapters';
import { AccountEligibilityCalculated, AccountEligibilityCalculatedProps } from '@oney/cdp-messages';
import * as nock from 'nock';
import { defaultLogger } from '@oney/logger-adapters';
import * as path from 'path';
import { initializePaymentKernel } from '../../fixtures/initializePaymentKernel';
import { mockedLimitedBankAccount } from '../../fixtures/smoneyUser/createBankAccountMock';
import { AccountEligibilityCalculatedEventHandler } from '../../../adapters/handlers/limits/AccountEligibilityCalculatedEventHandler';

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

describe('test AccountEligibilityCalculatedEventHandler', () => {
  let kernel: PaymentKernel;

  beforeAll(async () => {
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/accountEligibility`);
    nock.back.setMode('record');
    const { nockDone } = await nock.back('getAccessToken.json');

    kernel = await initializePaymentKernel({ useAzure: true });

    await kernel.initSubscribers();
    nockDone();
  });

  it('should use the appropriate command', async () => {
    // creating a bankAccount inmemory
    await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(mockedLimitedBankAccount);

    const props: AccountEligibilityCalculatedProps = {
      uId: mockedLimitedBankAccount.props.uid,
      eligibility: true,
      balanceLimit: 30000,
      timestamp: new Date(),
    };
    const event = new AccountEligibilityCalculated(props);

    const spy = (InitiateLimits.prototype.execute = jest.fn());

    const handlersUseCase = kernel.get(InitiateLimits);
    const handler = new AccountEligibilityCalculatedEventHandler(handlersUseCase, defaultLogger);

    await handler.handle(event);

    const expectedCommand: InitiateLimitsCommand = {
      uid: props.uId,
      globalOutMonthlyAllowance: props.balanceLimit,
      balanceLimit: props.balanceLimit,
      eligibility: props.eligibility,
    };
    expect(spy).toHaveBeenCalledWith(expectedCommand);

    spy.mockReset();
  });
});
