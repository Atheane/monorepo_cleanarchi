/**
 * @jest-environment node
 */
import 'reflect-metadata';
import {
  BankAccount,
  BankAccountError,
  BankAccountRepositoryWrite,
  PaymentIdentifier,
  RejectUncapping,
  RejectUncappingCommand,
  UncappingReason,
  UncappingState,
} from '@oney/payment-core';
import * as nock from 'nock';
import MockDate from 'mockdate';
import { ServiceBusClient } from '@azure/service-bus';
import * as path from 'path';
import { naruto } from './fixtures/config/naruto';
import { initializePaymentKernel } from './fixtures/initializePaymentKernel';
import { mockedLimitedBankAccount } from './fixtures/smoneyUser/createBankAccountMock';
import { stateChangingToCapped } from './fixtures/smoneyLimits/uncappingStatesChanged';
import { PaymentKernel } from '../di/PaymentKernel';

// init nockBack
const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures/smoneyUser`);
nockBack.setMode('record');
const smoneyScope = nock('https://sb-api.xpollens.com/api/V1.1');

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

describe('Test suite for rejectUncapping', () => {
  let saveFixture: Function;
  let kernel: PaymentKernel;
  let rejectUncapping: RejectUncapping;
  let mockBusSend: jest.Mock;

  beforeAll(async () => {
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/smoneyLimits`);
    nock.back.setMode('record');
    const { nockDone } = await nock.back('getAccessToken.json');

    // mock event bus
    mockBusSend = (ServiceBusClient.createFromConnectionString(null).createTopicClient(null).createSender()
      .send as unknown) as jest.Mock;

    kernel = await initializePaymentKernel({ useAzure: true });

    // getting the usecase from the container
    rejectUncapping = kernel.get(RejectUncapping);
    nockDone();
  });

  beforeEach(async () => {
    nock.restore();
    nock.activate();
    mockBusSend.mockClear();
    MockDate.set(new Date('2020-12-10T00:00:00.000Z'));
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
  });

  afterEach(async () => {
    MockDate.reset();
    const nockObjects = nock.recorder.play();
    if (nockObjects.length == 0) {
      nock.restore();
    } else {
      test.getFixtureName();
      saveFixture();
    }
    await smoneyScope.done();
  });

  it('should trigger event UncappingRejected and set BankAccount.uncappingState to CAPPED', async () => {
    // creating a bankAccount inmemory
    await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(mockedLimitedBankAccount);

    const command: RejectUncappingCommand = {
      uid: mockedLimitedBankAccount.props.uid,
      reason: UncappingReason.TAX_STATEMENT,
    };
    const bankAccount: BankAccount = await rejectUncapping.execute(command);
    expect(bankAccount.props.uid).toBe(mockedLimitedBankAccount.props.uid);
    expect(bankAccount.props.uncappingState).toBe(UncappingState.CAPPED);

    expect(mockBusSend).toHaveBeenCalledWith(stateChangingToCapped);
  });

  it('should NOT trigger event UncappingRejected and NOT set BankAccount.uncappingState to CAPPED', async () => {
    // creating a bankAccount inmemory
    await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(mockedLimitedBankAccount);

    const command: RejectUncappingCommand = { uid: 'unknown_id', reason: UncappingReason.TAX_STATEMENT };

    try {
      await rejectUncapping.execute(command);
    } catch (err) {
      expect(err).toStrictEqual(new BankAccountError.BankAccountNotFound('BANK_ACCOUNT_NOT_FOUND'));
      expect(mockBusSend).not.toHaveBeenCalledWith(stateChangingToCapped);
    }
  });
});
