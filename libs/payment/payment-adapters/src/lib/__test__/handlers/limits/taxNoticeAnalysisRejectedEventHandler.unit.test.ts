import { TaxNoticeAnalysisRejected } from '@oney/profile-messages';
import {
  BankAccountRepositoryWrite,
  PaymentIdentifier,
  RejectUncapping,
  RejectUncappingCommand,
  UncappingReason,
} from '@oney/payment-core';
import { PaymentKernel } from '@oney/payment-adapters';
import * as nock from 'nock';
import * as path from 'path';
import { initializePaymentKernel } from '../../fixtures/initializePaymentKernel';
import { mockedLimitedBankAccount } from '../../fixtures/smoneyUser/createBankAccountMock';
import { TaxNoticeAnalysisRejectedEventHandler } from '../../../adapters/handlers/limits/TaxNoticeAnalysisRejectedEventHandler';

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
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/taxAnalysisReject`);
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

    const props = {};
    const metadata = {
      aggregateId: mockedLimitedBankAccount.props.uid,
      type: 'test',
      eventName: 'PROFILE_ACTIVATED',
      aggregate: 'test',
      boundedContext: 'profile',
      version: 1,
    };
    const event = new TaxNoticeAnalysisRejected(props, metadata);

    const spy = (RejectUncapping.prototype.execute = jest.fn());

    const handlersUseCase = kernel.get(RejectUncapping);
    const handler = new TaxNoticeAnalysisRejectedEventHandler(handlersUseCase);

    await handler.handle(event);

    const expectedCommand: RejectUncappingCommand = {
      uid: metadata.aggregateId,
      reason: UncappingReason.TAX_STATEMENT,
    };
    expect(spy).toHaveBeenCalledWith(expectedCommand);

    spy.mockReset();
  });
});
