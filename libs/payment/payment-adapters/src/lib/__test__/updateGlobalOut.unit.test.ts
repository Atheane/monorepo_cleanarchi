/**
 * @jest-environment node
 */
import 'reflect-metadata';
import {
  BankAccount,
  BankAccountRepositoryWrite,
  PaymentIdentifier,
  UpdateGlobalOut,
  UpdateGlobalOutCommand,
} from '@oney/payment-core';
import * as nock from 'nock';
import MockDate from 'mockdate';
import { ServiceBusClient } from '@azure/service-bus';
import { GlobalLimits } from '@oney/payment-core';
import * as path from 'path';
import { naruto } from './fixtures/config/naruto';
import { initializePaymentKernel } from './fixtures/initializePaymentKernel';
import {
  mockedLimitedBankAccount,
  mockedUncappedBankAccount,
} from './fixtures/smoneyUser/createBankAccountMock';
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

describe('Test suite for ApplyCustomLimitBalanceCalculated', () => {
  let saveFixture: Function;
  let kernel: PaymentKernel;
  let updateGlobalOut: UpdateGlobalOut;
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
    updateGlobalOut = kernel.get(UpdateGlobalOut);
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

  it('should update globalOut if uncappingState is true', async () => {
    // creating a bankAccount inmemory
    await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(mockedLimitedBankAccount);

    const newMonthlyGlobalOutAllowance = 400;
    const command: UpdateGlobalOutCommand = {
      uid: mockedLimitedBankAccount.props.uid,
      eligibility: true,
      monthlyGlobalOutAllowance: newMonthlyGlobalOutAllowance,
    };
    const initialGlobalOut: GlobalLimits = Object.assign(
      mockedLimitedBankAccount.props.limits.props.globalOut,
    );

    const bankAccount: BankAccount = await updateGlobalOut.execute(command);

    const expectedFinalGlobalOut: GlobalLimits = {
      weeklyAllowance: newMonthlyGlobalOutAllowance,
      monthlyAllowance: newMonthlyGlobalOutAllowance,
      annualAllowance: newMonthlyGlobalOutAllowance * 12,
    };

    expect(bankAccount.props.limits.props.globalOut).toStrictEqual(expectedFinalGlobalOut);
    // checking final values are different than the beginning ones
    expect(bankAccount.props.limits.props.globalOut).not.toStrictEqual(initialGlobalOut);
  });

  it('should update globalOut if uncappingState is true', async () => {
    // creating a bankAccount inmemory
    await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(mockedUncappedBankAccount);

    const newMonthlyGlobalOutAllowance = 40000;
    const command: UpdateGlobalOutCommand = {
      uid: mockedUncappedBankAccount.props.uid,
      eligibility: true,
      monthlyGlobalOutAllowance: newMonthlyGlobalOutAllowance,
    };

    const bankAccount: BankAccount = await updateGlobalOut.execute(command);
    expect(bankAccount.props.limits.props.globalOut).toStrictEqual(
      mockedUncappedBankAccount.props.limits.props.globalOut,
    );
  });
});
