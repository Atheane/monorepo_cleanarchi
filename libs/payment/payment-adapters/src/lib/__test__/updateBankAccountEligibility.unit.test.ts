/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { EventDispatcher } from '@oney/messages-core';
import { PaymentKernel } from '@oney/payment-adapters';
import {
  BankAccountRepositoryWrite,
  PaymentIdentifier,
  UpdateBankAccountEligibility,
} from '@oney/payment-core';
import MockDate from 'mockdate';
import * as nock from 'nock';
import * as path from 'path';
import { initializePaymentKernel } from './fixtures/initializePaymentKernel';
import { mockedLimitedBankAccount } from './fixtures/smoneyUser/createBankAccountMock';
import { updateBankAccountEligibilitySuccessPayload } from './fixtures/updateBankAccountEligibility/updateBankAccountEligibility.fixtures';

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

describe('UpdateBankAccountEligibility unit testing', () => {
  let kernel: PaymentKernel;
  let updateBankAccountEligibility: UpdateBankAccountEligibility;
  let saveFixture: Function;
  let spyOn_dispatch;

  beforeAll(async () => {
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/updateBankAccountEligibility`);
    nock.back.setMode('record');
    const { nockDone } = await nock.back('getAccessToken.json');

    kernel = await initializePaymentKernel({ useAzure: false });

    updateBankAccountEligibility = kernel.get(UpdateBankAccountEligibility);
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
  });

  afterAll(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('Should update the user bankaccount eligibility on granted', async () => {
    await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(mockedLimitedBankAccount);
    const updatedBankAccount = await updateBankAccountEligibility.execute({
      uid: mockedLimitedBankAccount.props.uid,
      accountEligibility: true,
    });

    expect(updatedBankAccount.props.productsEligibility.account).toBeTruthy();
    expect(spyOn_dispatch).toHaveBeenCalledWith(updateBankAccountEligibilitySuccessPayload);
  });

  it('Should update the user bankaccount eligibility on granted', async () => {
    await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(mockedLimitedBankAccount);
    const updatedBankAccount = await updateBankAccountEligibility.execute({
      uid: mockedLimitedBankAccount.props.uid,
      accountEligibility: true,
    });

    expect(updatedBankAccount.props.productsEligibility.account).toBeTruthy();
    expect(spyOn_dispatch).toHaveBeenCalledWith(updateBankAccountEligibilitySuccessPayload);
  });

  it('Should not update the user if the bankaccount eligibility is not granted', async () => {
    await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(mockedLimitedBankAccount);
    const updatedBankAccount = await updateBankAccountEligibility.execute({
      uid: mockedLimitedBankAccount.props.uid,
      accountEligibility: false,
    });

    expect(updatedBankAccount.props.productsEligibility.account).toBeFalsy();
    expect(spyOn_dispatch).toHaveBeenCalledTimes(0);
  });

  it('Should update the user bankaccount eligibility only once', async () => {
    await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(mockedLimitedBankAccount);
    const firstUpdatedBankAccount = await updateBankAccountEligibility.execute({
      uid: mockedLimitedBankAccount.props.uid,
      accountEligibility: true,
    });
    const secondUpdatedBankAccount = await updateBankAccountEligibility.execute({
      uid: mockedLimitedBankAccount.props.uid,
      accountEligibility: true,
    });

    expect(firstUpdatedBankAccount.props.productsEligibility.account).toBeTruthy();
    expect(secondUpdatedBankAccount.props.productsEligibility.account).toBeTruthy();
    expect(spyOn_dispatch).toHaveBeenCalledTimes(1);
    expect(spyOn_dispatch).toHaveBeenCalledWith(updateBankAccountEligibilitySuccessPayload);
  });
});
