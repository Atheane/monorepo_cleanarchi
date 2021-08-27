/**
 * @jest-environment node
 */
import 'reflect-metadata';
import * as nock from 'nock';
import { CreateBankAccount, FileExtensions, IdTypes, KycDocument } from '@oney/payment-core';
import * as path from 'path';
import { configuration } from './fixtures/config/Configuration';
import { naruto } from './fixtures/config/naruto';
import { initializePaymentKernel } from './fixtures/initializePaymentKernel';
import { PaymentKernel } from '../di/PaymentKernel';
import { SmoneyKycGateway } from '../adapters/gateways/SmoneyKycGateway';

const kycDocumentSpy = jest.spyOn(SmoneyKycGateway.prototype, 'createDocument');
const kycFiltersSpy = jest.spyOn(SmoneyKycGateway.prototype, 'setFilters');

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

describe('INTEGRATION CreateBankAccount', () => {
  let kernel: PaymentKernel;
  let createBankAccount: CreateBankAccount;

  let saveFixture: Function;

  beforeEach(async () => {
    nock.restore();
    nock.activate();
    const { nockDone } = await nock.back(test.getFixtureName());
    saveFixture = nockDone;
  });

  afterEach(() => {
    const nockObjects = nock.recorder.play();
    if (nockObjects.length == 0) {
      nock.restore();
    } else {
      console.log('saving nock fixture for: ', test.getFixtureName());
      saveFixture();
    }
  });

  beforeAll(async () => {
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/createBankAccount`);
    nock.back.setMode('record');
    const { nockDone } = await nock.back('getAccessToken.json');

    kernel = await initializePaymentKernel({ useAzure: true });

    createBankAccount = kernel.get(CreateBankAccount);
    nockDone();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    nock.cleanAll();
  });

  it('Should create a Bank Account with additionalStreet', async () => {
    const result = await createBankAccount.execute({
      uid: 'zARoItBES',
      city: 'Créteil',
      country: 'FR',
      street: '5 rue paul cezanne',
      additionalStreet: 'appartement 00',
      zipCode: '94000',
    });
    expect(result.props.iban).toBeTruthy();
    expect(result.props.bic).toBeTruthy();
    expect(result.props.bankAccountId).toBeTruthy();
    expect(kycDocumentSpy).not.toHaveBeenCalled();
    expect(kycFiltersSpy).not.toHaveBeenCalled();
  });

  it('Should create a Bank Account without additionalStreet', async () => {
    const result = await createBankAccount.execute({
      uid: 'zARoItBES',
      city: 'Créteil',
      country: 'FR',
      street: '5 rue paul cezanne',
      zipCode: '94000',
    });
    expect(result.props.iban).toBeTruthy();
    expect(result.props.bic).toBeTruthy();
    expect(result.props.bankAccountId).toBeTruthy();
    expect(kycDocumentSpy).not.toHaveBeenCalled();
    expect(kycFiltersSpy).not.toHaveBeenCalled();
  });

  it('Should upsert a Bank Account', async () => {
    const result = await createBankAccount.execute({
      uid: 'zARoItBES',
      city: 'Créteil',
      country: 'FR',
      street: '5 rue paul cezanne',
      zipCode: '94000',
    });
    expect(result.props.iban).toBeTruthy();
    expect(result.props.bic).toBeTruthy();
    expect(result.props.bankAccountId).toBeTruthy();
  });
});

describe('INTEGRATION CreateBankAccount with KYC', () => {
  let kernelWithKyc: PaymentKernel;
  let createBankAccountWithKyc: CreateBankAccount;

  let saveFixture: Function;

  beforeEach(async () => {
    test.getFixtureName();
    nock.restore();
    nock.activate();
    const { nockDone } = await nock.back(test.getFixtureName());
    saveFixture = nockDone;
  });

  afterEach(() => {
    const nockObjects = nock.recorder.play();
    if (nockObjects.length == 0) {
      nock.restore();
    } else {
      console.log('saving nock fixture for: ', test.getFixtureName());
      saveFixture();
    }
  });

  beforeAll(async () => {
    const envConfiguration = {
      ...configuration,
      featureFlagKycOnCreation: true,
    };

    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/createBankAccount`);
    nock.back.setMode('record');
    const { nockDone } = await nock.back('getAccessToken.json');

    kernelWithKyc = await initializePaymentKernel({ useAzure: true, envConf: envConfiguration });

    createBankAccountWithKyc = kernelWithKyc.get(CreateBankAccount);
    nockDone();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    nock.cleanAll();
  });

  it('Should create a Bank Account and send KYC document and filters', async () => {
    const result = await createBankAccountWithKyc.execute({
      uid: 'zARoItBES',
      city: 'Créteil',
      country: 'FR',
      street: '5 rue paul cezanne',
      zipCode: '94000',
    });
    expect(result.props.iban).toBeTruthy();
    expect(result.props.bic).toBeTruthy();
    expect(result.props.bankAccountId).toBeTruthy();
    expect(kycDocumentSpy).toHaveBeenCalledWith(
      new KycDocument({
        uid: 'zARoItBES',
        files: [
          {
            type: IdTypes.ID_FRONT,
            extString: FileExtensions.JPEG,
            file: new Buffer(''),
          },
        ],
      }),
    );
    expect(kycFiltersSpy).toHaveBeenCalledWith({
      uid: 'zARoItBES',
      kycValues: { decision: 'OK', politicallyExposed: 'OK', sanctioned: 'OK' },
    });
  });

  it('Should create a Bank Account and not send KYC document and filters when data not available', async () => {
    const result = await createBankAccountWithKyc.execute({
      uid: 'zARoItBES',
      city: 'Créteil',
      country: 'FR',
      street: '5 rue paul cezanne',
      zipCode: '94000',
    });
    expect(result.props.iban).toBeTruthy();
    expect(result.props.bic).toBeTruthy();
    expect(result.props.bankAccountId).toBeTruthy();
    expect(kycDocumentSpy).not.toHaveBeenCalled();
    expect(kycFiltersSpy).not.toHaveBeenCalled();
  });

  it('Should create a Bank Account and only send KYC filters', async () => {
    const result = await createBankAccountWithKyc.execute({
      uid: 'zARoItBES',
      city: 'Créteil',
      country: 'FR',
      street: '5 rue paul cezanne',
      zipCode: '94000',
    });
    expect(result.props.iban).toBeTruthy();
    expect(result.props.bic).toBeTruthy();
    expect(result.props.bankAccountId).toBeTruthy();
    expect(kycDocumentSpy).not.toHaveBeenCalled();
    expect(kycFiltersSpy).toHaveBeenCalledWith({
      uid: 'zARoItBES',
      kycValues: { decision: 'PENDING_REVIEW', politicallyExposed: 'OK', sanctioned: 'OK' },
    });
  });

  it('Should create a Bank Account and only send KYC document', async () => {
    const result = await createBankAccountWithKyc.execute({
      uid: 'zARoItBES',
      city: 'Créteil',
      country: 'FR',
      street: '5 rue paul cezanne',
      zipCode: '94000',
    });
    expect(result.props.iban).toBeTruthy();
    expect(result.props.bic).toBeTruthy();
    expect(result.props.bankAccountId).toBeTruthy();
    expect(kycFiltersSpy).not.toHaveBeenCalled();
    expect(kycDocumentSpy).toHaveBeenCalledWith(
      new KycDocument({
        uid: 'zARoItBES',
        files: [
          {
            type: IdTypes.ID_FRONT,
            extString: FileExtensions.JPEG,
            file: new Buffer(''),
          },
        ],
      }),
    );
  });
});
