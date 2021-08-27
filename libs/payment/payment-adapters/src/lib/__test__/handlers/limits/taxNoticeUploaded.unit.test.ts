import {
  DocumentAdded,
  DocumentSide,
  DocumentType,
  ProfileDocumentPartner,
  ProfileDocumentProps,
} from '@oney/profile-messages';
import {
  AskUncapping,
  AskUncappingCommand,
  BankAccountRepositoryWrite,
  PaymentIdentifier,
  UncappingReason,
} from '@oney/payment-core';
import { PaymentKernel } from '@oney/payment-adapters';
import * as nock from 'nock';
import * as path from 'path';
import { initializePaymentKernel } from '../../fixtures/initializePaymentKernel';
import { mockedLimitedBankAccount } from '../../fixtures/smoneyUser/createBankAccountMock';
import { TaxNoticeUploadedEventHandler } from '../../../adapters/handlers/limits/TaxNoticeUploadedEventHandler';

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
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/taxUploaded`);
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

    const props: ProfileDocumentProps = {
      uid: mockedLimitedBankAccount.props.uid,
      type: DocumentType.TAX_NOTICE,
      location: 'here',
      partner: ProfileDocumentPartner.ODB,
      side: DocumentSide.FRONT,
    };

    const event = new DocumentAdded(props);

    // mock eventHandler dependency
    const spy = (AskUncapping.prototype.execute = jest.fn());
    const handlersUseCase = kernel.get(AskUncapping);
    const handler = new TaxNoticeUploadedEventHandler(handlersUseCase);

    await handler.handle(event);

    const expectedCommand: AskUncappingCommand = {
      uid: props.uid,
      reason: UncappingReason.TAX_STATEMENT,
    };
    expect(spy).toHaveBeenCalledWith(expectedCommand);

    spy.mockReset();
  });

  it('should handle NOT call the use case because document type is not tax notice', async () => {
    // creating a bankAccount inmemory
    await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(mockedLimitedBankAccount);

    const props: ProfileDocumentProps = {
      uid: mockedLimitedBankAccount.props.uid,
      type: DocumentType.PASSPORT,
      location: 'here',
      partner: ProfileDocumentPartner.ODB,
      side: DocumentSide.FRONT,
    };

    const event = new DocumentAdded(props);

    const spy = (AskUncapping.prototype.execute = jest.fn());

    const handlersUseCase = kernel.get(AskUncapping);
    const handler = new TaxNoticeUploadedEventHandler(handlersUseCase);

    await handler.handle(event);

    expect(spy).not.toHaveBeenCalled();

    spy.mockReset();
  });
});
