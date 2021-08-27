import { defaultLogger } from '@oney/logger-adapters';
import {
  BankAccountRepositoryWrite,
  PaymentIdentifier,
  UncapBankAccountUsingAggregatedAccounts,
  UncapBankAccountUsingAggregatedAccountsCommand,
} from '@oney/payment-core';
import { PaymentKernel } from '@oney/payment-adapters';
import { CustomBalanceLimitCalculated, CustomBalanceLimitCalculatedProps } from '@oney/cdp-messages';
import * as nock from 'nock';
import * as path from 'path';
import { initializePaymentKernel } from '../../fixtures/initializePaymentKernel';
import { mockedLimitedBankAccount } from '../../fixtures/smoneyUser/createBankAccountMock';
import { BalanceLimitUncappedCalculatedEventHandler } from '../../../adapters/handlers/bankAccount/BalanceLimitUncappedCalculatedEventHandler';

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

describe('Unit test of ProfileActivatedEventHandler', () => {
  let kernel: PaymentKernel;

  beforeAll(async () => {
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/uncappedLimit`);
    nock.back.setMode('record');
    const { nockDone } = await nock.back('getAccessToken.json');

    kernel = await initializePaymentKernel({ useAzure: true });

    await kernel.initSubscribers();
    nockDone();
  });

  it('should handle call the use case with the expected command', async () => {
    // creating a bankAccount inmemory
    await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(mockedLimitedBankAccount);

    const props: CustomBalanceLimitCalculatedProps = {
      uId: mockedLimitedBankAccount.props.uid,
      customBalanceLimitEligibility: true,
      customBalanceLimit: 300000,
      verifiedRevenues: 300000,
    };

    const event = new CustomBalanceLimitCalculated(props);

    // mock eventHandler dependencies
    const spy = (UncapBankAccountUsingAggregatedAccounts.prototype.execute = jest.fn());

    const handlersUseCase = kernel.get(UncapBankAccountUsingAggregatedAccounts);
    const handler = new BalanceLimitUncappedCalculatedEventHandler(handlersUseCase, defaultLogger);

    await handler.handle(event);

    const expectedCommand: UncapBankAccountUsingAggregatedAccountsCommand = {
      uId: props.uId,
      customBalanceLimit: props.customBalanceLimit,
      customBalanceLimitEligibility: props.customBalanceLimitEligibility,
    };
    expect(spy).toHaveBeenCalledWith(expectedCommand);

    spy.mockReset();
  });
});
