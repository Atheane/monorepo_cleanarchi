/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { EventDispatcher } from '@oney/messages-core';
import {
  BankAccount,
  BankAccountRepositoryWrite,
  InitiateLimits,
  InitiateLimitsCommand,
  LimitInformationProperties,
  PaymentIdentifier,
} from '@oney/payment-core';
import MockDate from 'mockdate';
import * as nock from 'nock';
import * as path from 'path';
import { naruto } from './fixtures/config/naruto';
import { initializePaymentKernel } from './fixtures/initializePaymentKernel';
import { limitsInitializedEvent } from './fixtures/smoneyLimits/createLimitsInitializedEvent.fixtures';
import { bankAccountWithJustConstructedLimits } from './fixtures/smoneyUser/createBankAccountMock';
import { getProfileByIdMock } from './stubs/getProfileByIdMock';
import { PaymentKernel } from '../di/PaymentKernel';
import { OdbGetProfileInformationGateway } from '../adapters/gateways/OdbGetProfileInformationGateway';

// init nockBack
const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures/smoneyUser`);
nockBack.setMode('record');
const smoneyScope = nock('https://sb-api.xpollens.com/api/V1.1');

jest.mock('uuid', () => ({
  v4: () => 'uuid_v4_example',
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

describe('test initiateLimitsLocally', () => {
  let saveFixture: Function;
  let kernel: PaymentKernel;
  let initiateLimits: InitiateLimits;
  let spyOn_dispatch;

  beforeAll(async () => {
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/smoneyLimits`);
    nock.back.setMode('record');
    const { nockDone } = await nock.back('getAccessToken.json');

    kernel = await initializePaymentKernel({ useAzure: false });

    // getting the usecase from the container
    initiateLimits = kernel.get(InitiateLimits);
    nockDone();
  });

  beforeEach(async () => {
    nock.restore();
    nock.activate();
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

    const dispatcher = kernel.get(EventDispatcher);
    spyOn_dispatch = jest.spyOn(dispatcher, 'dispatch');
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
    smoneyScope.done();
  });

  afterAll(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('should set limits to appropriate values', async () => {
    // creating a bankAccount inmemory
    await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(bankAccountWithJustConstructedLimits);

    // fast mock of _getProfileInformationGateway
    OdbGetProfileInformationGateway.prototype.getById = getProfileByIdMock;

    const balanceLimit = 1000;
    const command: InitiateLimitsCommand = {
      uid: bankAccountWithJustConstructedLimits.props.uid,
      balanceLimit,
      globalOutMonthlyAllowance: balanceLimit,
      eligibility: true,
    };
    const bankAccount: BankAccount = await initiateLimits.execute(command);
    expect(bankAccount.props.uid).toBe(bankAccountWithJustConstructedLimits.props.uid);
    expect(bankAccount.props.bankAccountId).toBe(bankAccountWithJustConstructedLimits.props.bankAccountId);

    const expectedLimits: LimitInformationProperties = {
      globalOut: {
        annualAllowance: 45000, // 1M€ en prod
        monthlyAllowance: balanceLimit,
        weeklyAllowance: balanceLimit,
      },
      globalIn: {
        annualAllowance: 45000,
        monthlyAllowance: 3000,
        weeklyAllowance: 3000,
      },
      balanceLimit: balanceLimit,
      technicalLimit: balanceLimit,
    };
    expect(bankAccount.props.limits.props).toStrictEqual(expectedLimits);
    expect(spyOn_dispatch).toHaveBeenCalledWith(limitsInitializedEvent);
  });

  it('should NOT set limits to appropriate values', async () => {
    // fast mock of _getProfileInformationGateway
    OdbGetProfileInformationGateway.prototype.getById = getProfileByIdMock;

    const balanceLimit = 1000;
    const command: InitiateLimitsCommand = {
      uid: bankAccountWithJustConstructedLimits.props.uid,
      balanceLimit,
      globalOutMonthlyAllowance: balanceLimit,
      eligibility: false,
    };
    const result = await initiateLimits.execute(command);

    expect(result).toBeNull();
  });
});
