import {
  AskUncapping,
  AskUncappingCommand,
  BankAccountRepositoryWrite,
  PaymentIdentifier,
  UncappingReason,
} from '@oney/payment-core';
import { PaymentKernel } from '@oney/payment-adapters';
import * as nock from 'nock';
import { CheckAggregatedAccountsIncomes, CheckAggregatedAccountsIncomesProps } from '@oney/payment-messages';
import * as path from 'path';
import { initializePaymentKernel } from '../../fixtures/initializePaymentKernel';
import { mockedLimitedBankAccount } from '../../fixtures/smoneyUser/createBankAccountMock';
import { CheckAggregatedAccountsIncomesEventHandler } from '../../../adapters/handlers/limits/CheckAggregatedAccountsIncomesEventHandler';

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

describe('test CheckAggregatedAccountsIncomesEventHandler', () => {
  let kernel: PaymentKernel;

  beforeAll(async () => {
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/bankAccountActivated`);
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

    const props: CheckAggregatedAccountsIncomesProps = {
      uid: mockedLimitedBankAccount.props.uid,
    };
    const event = new CheckAggregatedAccountsIncomes(props);

    // mock eventHandler dependency
    const spy = (AskUncapping.prototype.execute = jest.fn());

    const handlersUseCase = kernel.get(AskUncapping);
    const handler = new CheckAggregatedAccountsIncomesEventHandler(handlersUseCase);
    await handler.handle(event);

    const expectedCommand: AskUncappingCommand = {
      uid: mockedLimitedBankAccount.props.uid,
      reason: UncappingReason.AGGREGATION,
    };
    expect(spy).toHaveBeenCalledWith(expectedCommand);

    spy.mockReset();
  });
});
