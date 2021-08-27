import {
  BankAccountRepositoryWrite,
  CheckToEvaluateAccount,
  CheckToEvaluateAccountCommand,
  PaymentIdentifier,
} from '@oney/payment-core';
import { PaymentKernel } from '@oney/payment-adapters';
import { AggregatedAccountsIncomesChecked, AggregatedAccountsIncomesCheckedProps } from '@oney/cdp-messages';
import * as nock from 'nock';
import * as path from 'path';
import { initializePaymentKernel } from '../../fixtures/initializePaymentKernel';
import { mockedLimitedBankAccount } from '../../fixtures/smoneyUser/createBankAccountMock';
import { AggregatedAccountsIncomesCheckedEventHandler } from '../../../adapters/handlers/limits/AggregatedAccountsIncomesCheckedEventHandler';

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
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/aggIncomeChecked`);
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

    const props: AggregatedAccountsIncomesCheckedProps = {
      uid: mockedLimitedBankAccount.props.uid,
      verifications: [],
    };
    const event = new AggregatedAccountsIncomesChecked(props);

    const usecaseSpyOn = (CheckToEvaluateAccount.prototype.execute = jest.fn());

    const handlersUseCase = kernel.get(CheckToEvaluateAccount);
    const handler = new AggregatedAccountsIncomesCheckedEventHandler(handlersUseCase);

    await handler.handle(event);

    const expectedCommand: CheckToEvaluateAccountCommand = {
      uid: props.uid,
      aggregatedAccounts: props.verifications,
    };
    expect(usecaseSpyOn).toHaveBeenCalledWith(expectedCommand);
  });
});
