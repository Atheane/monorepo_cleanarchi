/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { Debt, DebtStatus, PaymentIdentifier, SyncAccountDebts, WriteService } from '@oney/payment-core';
import * as nock from 'nock';
import { defaultLogger } from '@oney/logger-adapters';
import * as queryString from 'querystring';
import * as path from 'path';
import { naruto } from './fixtures/config/naruto';
import { initializePaymentKernel } from './fixtures/initializePaymentKernel';
import { PaymentKernel } from '../di/PaymentKernel';
import { RawSmoDebtReceivedHandler } from '../adapters/handlers/debt/RawSmoDebtReceivedHandler';

const before = (scope: any) => {
  // eslint-disable-next-line no-param-reassign
  scope.filteringRequestBody = (body: string, aRecordedBody: any) => {
    const { of: currentOffset } = queryString.parse(`?${body}`);
    const { of: recordedOffset } = queryString.parse(`?${body}`);
    if (!(currentOffset || recordedOffset)) {
      // Just replace the saved body by a new one
      // eslint-disable-next-line no-param-reassign
      delete aRecordedBody.orderid;
      return aRecordedBody;
    }
    if (currentOffset === recordedOffset) {
      return aRecordedBody;
    }
    return body;
  };
};

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
            readableStreamBody: new Uint8Array(naruto[0] as any),
          }),
        }),
      }),
    }),
  },
}));

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures/smoneyDebt`);
nockBack.setMode('record');

describe('Test suite for p2p', () => {
  let kernel: PaymentKernel;
  let writeService: WriteService;
  let aBankAccount;

  beforeAll(async () => {
    const { nockDone } = await nockBack('getAccessToken.json', { before });

    kernel = await initializePaymentKernel({ useAzure: true });

    writeService = kernel.get<WriteService>(PaymentIdentifier.accountManagementWriteService);
    aBankAccount = {
      _id: '5f7c6ff44d0bca0013e5d982',
      uid: 'client-112',
      bid: '2520',
      iban: 'FR0612869000020PC000001Y059',
      bic: 'SMOEFRP1',
      beneficiaries: [],
      cards: [],
    };
    await writeService.upsert({ uid: aBankAccount.uid }, aBankAccount);
    nockDone();
  });

  afterAll(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('should handle debt creation when raw smo debt event is received', async () => {
    const { nockDone } = await nockBack('getAllClientDebt.json', { before });

    const rawSmoDebtReceivedHandler = new RawSmoDebtReceivedHandler(
      kernel.get(SyncAccountDebts),
      defaultLogger,
    );
    const message = {
      id: 'opakze',
      props: {
        userId: 'client-112',
      },
    } as any;
    const result = await rawSmoDebtReceivedHandler.handle(message);

    const expectDebts = [
      new Debt({
        id: 'FDEAED10122',
        userId: 'kTDhDRrHv',
        date: new Date('2021-01-18T15:09:31.570Z'),
        debtAmount: 10,
        remainingDebtAmount: 10,
        status: DebtStatus.PENDING,
        reason: 'P2P',
        collections: [],
      }),
      new Debt({
        id: 'CDDFFC03204',
        userId: 'kTDhDRrHv',
        date: new Date('2021-01-18T13:35:15.403Z'),
        debtAmount: 10,
        remainingDebtAmount: 10,
        status: DebtStatus.PENDING,
        reason: 'P2P',
        collections: [],
      }),
    ];
    expect(result.props.debts).toEqual(expectDebts);

    nockDone();
  });
});
