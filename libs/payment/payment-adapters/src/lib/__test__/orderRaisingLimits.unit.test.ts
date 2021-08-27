/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { EventDispatcher } from '@oney/messages-core';
import {
  BankAccountRepositoryWrite,
  OrderRaisingLimits,
  OrderRaisingLimitsCommand,
  PaymentIdentifier,
} from '@oney/payment-core';
import MockDate from 'mockdate';
import * as nock from 'nock';
import * as path from 'path';
import { naruto } from './fixtures/config/naruto';
import { initializePaymentKernel } from './fixtures/initializePaymentKernel';
import { uncapLimitsEvent } from './fixtures/smoneyLimits/createUncapLimitsEvent.fixtures';
import { mockedLimitedBankAccount } from './fixtures/smoneyUser/createBankAccountMock';
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

describe('Test suite for uncapLimits', () => {
  let saveFixture: Function;
  let kernel: PaymentKernel;
  let orderRaisingLimits: OrderRaisingLimits;
  let spyOn_dispatch;

  beforeAll(async () => {
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/smoneyLimits`);
    nock.back.setMode('record');
    const { nockDone } = await nock.back('getAccessToken.json');

    kernel = await initializePaymentKernel({ useAzure: false });

    // getting the usecase from the container
    orderRaisingLimits = kernel.get(OrderRaisingLimits);
    nockDone();

    const dispatcher = kernel.get(EventDispatcher);
    spyOn_dispatch = jest.spyOn(dispatcher, 'dispatch');
  });

  beforeEach(async () => {
    nock.restore();
    nock.activate();
    MockDate.set(new Date('2020-12-10T00:00:00.000Z'));
    const { nockDone } = await nock.back(test.getFixtureName());
    saveFixture = nockDone;
    jest.clearAllMocks();
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

  it('testing usecase orderRaisingLimits with kernel substitutions', async () => {
    // creating a bankAccount inmemory
    await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(mockedLimitedBankAccount);

    const command: OrderRaisingLimitsCommand = { uid: mockedLimitedBankAccount.props.uid };
    await orderRaisingLimits.execute(command);

    expect(spyOn_dispatch).toHaveBeenCalledWith(uncapLimitsEvent);
  });
});
