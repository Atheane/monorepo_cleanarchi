/**
 * @jest-environment node
 */
import 'reflect-metadata';
import {
  BankAccount,
  BankAccountRepositoryWrite,
  PaymentIdentifier,
  UncappingReason,
  UncappingState,
  Uncap,
  UncapCommand,
} from '@oney/payment-core';
import * as nock from 'nock';
import MockDate from 'mockdate';
import { ServiceBusClient } from '@azure/service-bus';
import { PaymentKernel } from '@oney/payment-adapters';
import * as path from 'path';
import { configuration } from './fixtures/config/Configuration';
import { initializePaymentKernel } from './fixtures/initializePaymentKernel';
import { mockedLimitedBankAccount } from './fixtures/smoneyUser/createBankAccountMock';
import { getProfileByIdMock } from './stubs/getProfileByIdMock';
import { OdbGetProfileInformationGateway } from '../adapters/gateways/OdbGetProfileInformationGateway';

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
            readableStreamBody: new Uint8Array(Buffer.from('')),
          }),
        }),
      }),
    }),
  },
}));

describe('INTEGRATION CustomLimitBalance', () => {
  let saveFixture: Function;
  let kernel: PaymentKernel;
  let uncap: Uncap;
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
    uncap = kernel.get(Uncap);
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

  it('should uncap eligibility being true', async () => {
    // creating a bankAccount inmemory
    await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(mockedLimitedBankAccount);

    // fast mock of _getProfileInformationGateway
    OdbGetProfileInformationGateway.prototype.getById = getProfileByIdMock;

    const customBalanceLimit = 2000;
    const command: UncapCommand = {
      uid: mockedLimitedBankAccount.props.uid,
      eligibility: true,
      monthlyGlobalOutAllowance: customBalanceLimit,
      reason: UncappingReason.TAX_STATEMENT,
    };

    const bankAccount: BankAccount = await uncap.execute(command);
    expect(bankAccount.props.uncappingState).toBe(UncappingState.UNCAPPED);
    expect(bankAccount.props.limits.props.globalOut.weeklyAllowance).toBe(customBalanceLimit);
    expect(bankAccount.props.limits.props.globalOut.monthlyAllowance).toBe(customBalanceLimit);
    expect(bankAccount.props.limits.props.globalOut.annualAllowance).toBe(
      mockedLimitedBankAccount.props.limits.props.globalOut.annualAllowance,
    );
    expect(bankAccount.props.limits.props.balanceLimit).toBe(configuration.uncappedBalanceLimit);
  });

  it('should not uncap limits with customBalanceLimit when not eligible', async () => {
    // creating a bankAccount inmemory
    await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(mockedLimitedBankAccount);

    // fast mock of _getProfileInformationGateway
    OdbGetProfileInformationGateway.prototype.getById = getProfileByIdMock;

    const customBalanceLimit = 2000;
    const command: UncapCommand = {
      uid: mockedLimitedBankAccount.props.uid,
      eligibility: false,
      monthlyGlobalOutAllowance: customBalanceLimit,
      reason: UncappingReason.TAX_STATEMENT,
    };

    const bankAccount: BankAccount = await uncap.execute(command);
    expect(bankAccount.props.uncappingState).toBe(UncappingState.CAPPED);
    expect(bankAccount.props.limits.props.globalOut).toStrictEqual(
      mockedLimitedBankAccount.props.limits.props.globalOut,
    );
    expect(bankAccount.props.limits.props.balanceLimit).toStrictEqual(
      mockedLimitedBankAccount.props.limits.props.balanceLimit,
    );
  });
});
