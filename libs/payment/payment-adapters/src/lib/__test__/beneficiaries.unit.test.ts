/**
 * @jest-environment node
 */
import 'reflect-metadata';
import {
  BeneficiaryError,
  CreateBeneficiary,
  GetBeneficiary,
  PaymentIdentifier,
  WriteService,
} from '@oney/payment-core';
import { EventDispatcher } from '@oney/messages-core';
import * as nock from 'nock';
import MockDate from 'mockdate';
import * as queryString from 'querystring';
import * as path from 'path';
import { naruto } from './fixtures/config/naruto';
import { initializePaymentKernel } from './fixtures/initializePaymentKernel';
import {
  mockyBankAccount,
  addBeneficiaryMockBankAccount,
  addBeneficiaryDomainEvent,
} from './fixtures/smoneyBeneficiaries/beneficiaries.fixtures';
import { PaymentKernel } from '../di/PaymentKernel';

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures/smoneyBeneficiaries`);
nockBack.setMode('record');

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

jest.mock('uuid', () => ({
  v4: () => 'uuid_v4_example',
}));

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

describe('Beneficiary Unit test', () => {
  let kernel: PaymentKernel;
  let writeService: WriteService;
  let getBeneficiary: GetBeneficiary;
  let createBeneficiary: CreateBeneficiary;

  beforeAll(async () => {
    const { nockDone } = await nockBack('getAccessToken.json', { before });

    kernel = await initializePaymentKernel({ useAzure: true });
    writeService = kernel.get<WriteService>(PaymentIdentifier.accountManagementWriteService);
    await writeService.upsert({ uid: mockyBankAccount.uid }, mockyBankAccount);
    await writeService.upsert({ uid: addBeneficiaryMockBankAccount.uid }, addBeneficiaryMockBankAccount);
    getBeneficiary = kernel.get(GetBeneficiary);
    createBeneficiary = kernel.get(CreateBeneficiary);
    nockDone();
  });

  afterAll(async () => {
    await writeService.clear();
    jest.clearAllMocks();
    nock.cleanAll();
    nock.enableNetConnect();
  });

  describe('Get beneficiary', () => {
    it('Should throw beneficiary not found', async () => {
      const result = getBeneficiary.execute({
        beneficiaryId: 'qzdazd',
        uid: '_lHXbttPN',
      });
      await expect(result).rejects.toThrow(BeneficiaryError.BeneficiaryNotFound);
    });

    it('Should get a beneficiary', async () => {
      const result = await getBeneficiary.execute({
        beneficiaryId: '1519',
        uid: '_lHXbttPN',
      });
      expect(result.props.email).toEqual('conor@ufc.com');
      expect(result.id).toEqual('1519');
    });
  });

  describe('Add beneficiary', () => {
    let spyOn_dispatch;
    let saveFixture: Function;

    beforeEach(async () => {
      MockDate.set(new Date('2020-12-10T00:00:00.000Z'));
      nock.restore();
      nock.activate();
      /**
       * nock back available modes:
       * - wild: all requests go out to the internet, don't replay anything, doesn't record anything
       * - dryrun: The default, use recorded nocks, allow http calls, doesn't record anything, useful for writing new tests
       * - record: use recorded nocks, record new nocks
       * - lockdown: use recorded nocks, disables all http calls even when not nocked, doesn't record
       * @see https://github.com/nock/nock#modes
       */
      const { nockDone } = await nock.back(test.getFixtureName());
      saveFixture = nockDone;

      const dispatcher = kernel.get(EventDispatcher);
      spyOn_dispatch = jest.spyOn(dispatcher, 'dispatch');
    });

    afterEach(() => {
      MockDate.reset();
      const nockObjects = nock.recorder.play();
      if (nockObjects.length == 0) {
        nock.restore();
      } else {
        console.log('saving nock fixture for: ', test.getFixtureName());
        saveFixture();
      }
    });

    it('Should create a beneficiary', async () => {
      const beneficiary = await createBeneficiary.execute({
        uid: addBeneficiaryMockBankAccount.uid,
        bic: 'BACCFR23XXX',
        name: 'Beneficiary guy',
        email: 'lagrossemoula@yopmail.com',
        iban: 'FR4112869000020PC000005JN24',
      });

      expect(beneficiary).toEqual({
        bic: 'BAxxxxxxxXX',
        email: 'lagrossemoula@yopmail.com',
        iban: 'FR41XXXXXXXXXXXXXXXXJN24',
        id: 3840,
        name: 'Beneficiary guy',
        status: 1,
      });
      expect(spyOn_dispatch).toBeCalledWith(addBeneficiaryDomainEvent);
    });
  });
});
