/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { EventDispatcher } from '@oney/messages-core';
import { PaymentKernel } from '@oney/payment-adapters';
import { BankAccountRepositoryRead, CreateBankAccount, PaymentIdentifier } from '@oney/payment-core';
import MockDate from 'mockdate';
import * as nock from 'nock';
import * as path from 'path';
import { initializePaymentKernel } from './fixtures/initializePaymentKernel';
import {
  bankAccountCreatedDomainEvent,
  bankAccountOpenedDomainEvent,
} from './fixtures/smoneyUser/createBankAccount.fixtures';

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
            readableStreamBody: new Uint8Array(Buffer.from('')),
          }),
        }),
      }),
    }),
  },
}));

describe('INTEGRATION CreateBankAccount', () => {
  let kernel: PaymentKernel;
  let createBankAccount: CreateBankAccount;
  let saveFixture: Function;
  let spyOn_dispatch;

  beforeAll(async () => {
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/smoneyUser`);
    nock.back.setMode('record');
    const { nockDone } = await nock.back('getAccessTokenCreateBankAccount.json');

    kernel = await initializePaymentKernel({ useAzure: false });

    createBankAccount = kernel.get(CreateBankAccount);
    nockDone();

    const dispatcher = kernel.get(EventDispatcher);
    spyOn_dispatch = jest.spyOn(dispatcher, 'dispatch');
  });

  beforeEach(async () => {
    MockDate.set(new Date('2020-12-10T00:00:00.000Z'));
    nock.restore();
    nock.activate();

    jest.clearAllMocks();

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

  afterEach(() => {
    MockDate.reset();
    const nockObjects = nock.recorder.play();
    if (nockObjects.length == 0) {
      nock.restore();
    } else {
      console.log('saving nock fixture for: ', test.getFixtureName());
      saveFixture();
    }
    jest.clearAllMocks();
  });

  afterAll(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('Should emit BankAccountOpened when creating a bank account', async () => {
    const bankAccount = await createBankAccount.execute({
      uid: 'yDvDwEHPq',
      city: 'Créteil',
      country: 'FR',
      street: '5 rue paul cezanne',
      zipCode: '94000',
    });

    const createdBankAccount = await kernel
      .get<BankAccountRepositoryRead>(PaymentIdentifier.bankAccountRepositoryRead)
      .findById(bankAccount.id);

    expect(createdBankAccount.props.uid).toEqual(bankAccount.id);
    expect(createdBankAccount.props.iban).toBeTruthy();
    expect(createdBankAccount.props.bic).toBeTruthy();
    expect(createdBankAccount.props.bankAccountId).toBeTruthy();

    expect(spyOn_dispatch).toHaveBeenCalledWith(bankAccountCreatedDomainEvent, bankAccountOpenedDomainEvent);
  });
});
