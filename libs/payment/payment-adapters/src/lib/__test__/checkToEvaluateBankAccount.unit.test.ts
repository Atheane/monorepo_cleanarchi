/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { EventDispatcher } from '@oney/messages-core';
import {
  BankAccountRepositoryRead,
  BankAccountRepositoryWrite,
  CheckToEvaluateAccount,
  CheckToEvaluateAccountCommand,
  PaymentIdentifier,
} from '@oney/payment-core';
import MockDate from 'mockdate';
import * as nock from 'nock';
import * as path from 'path';
import { naruto } from './fixtures/config/naruto';
import { initializePaymentKernel } from './fixtures/initializePaymentKernel';
import { mockedLimitedBankAccount } from './fixtures/smoneyUser/createBankAccountMock';
import { evaluateBankAccountToUncapLimit } from './fixtures/smoneyLimits/evaluateBankAccountToUncapLimits';
import { stateChangingToCappedObject } from './fixtures/smoneyLimits/uncappingStatesChanged';
import { PaymentKernel } from '../di/PaymentKernel';

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

describe('Test suite for initiateLimitInformation', () => {
  let saveFixture: Function;
  let kernel: PaymentKernel;
  let checkToEvaluateAccount: CheckToEvaluateAccount;
  let spyOn_dispatch;
  let spyOn_repositoryRead_findById;

  beforeAll(async () => {
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/smoneyLimits`);
    nock.back.setMode('record');
    const { nockDone } = await nock.back('getAccessToken.json');

    kernel = await initializePaymentKernel({ useAzure: false });

    // getting the usecase from the container
    checkToEvaluateAccount = kernel.get(CheckToEvaluateAccount);
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
    const repositoryRead = kernel.get<BankAccountRepositoryRead>(PaymentIdentifier.bankAccountRepositoryRead);
    spyOn_repositoryRead_findById = jest.spyOn(repositoryRead, 'findById');
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

  it('should send message to evaluate account if at least one contain income', async () => {
    // creating a bankAccount inmemory
    await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(mockedLimitedBankAccount);

    const validId = 42;
    const invalidId = 0;

    const command: CheckToEvaluateAccountCommand = {
      uid: mockedLimitedBankAccount.props.uid,
      aggregatedAccounts: [
        { accountAggregatedId: validId, valid: true },
        { accountAggregatedId: invalidId, valid: false },
      ],
    };

    await checkToEvaluateAccount.execute(command);
    expect(spyOn_dispatch).toHaveBeenCalledWith(evaluateBankAccountToUncapLimit);
    expect(spyOn_repositoryRead_findById).not.toHaveBeenCalled();
  });

  it('should send message of uncappingState to capped if no income found', async () => {
    // creating a bankAccount inmemory
    await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(mockedLimitedBankAccount);

    const command: CheckToEvaluateAccountCommand = {
      uid: mockedLimitedBankAccount.props.uid,
      aggregatedAccounts: [
        { accountAggregatedId: 0, valid: false },
        { accountAggregatedId: 42, valid: false },
      ],
    };

    await checkToEvaluateAccount.execute(command);
    // TODO check spyOn_repositoryRead_findById
    // expect(spyOn_repositoryRead_findById).toHaveBeenCalledWith(mockedLimitedBankAccount.props.uid);
    expect(spyOn_dispatch).toHaveBeenCalledWith(stateChangingToCappedObject);
  });
});
