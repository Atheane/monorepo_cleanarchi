/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import {
  BankAccountType,
  CreateP2P,
  PaymentError,
  Recurrency,
  TagError,
  TagRepositoryRead,
  TransferFrequencyType,
  P2PErrors,
} from '@oney/payment-core';
import * as nock from 'nock';
import * as queryString from 'querystring';
import * as path from 'path';
import { naruto } from './fixtures/config/naruto';
import { initializePaymentKernel } from './fixtures/initializePaymentKernel';
import { OdbP2PRepositoryRead } from '../adapters/repositories/odb/OdbP2PRepositoryRead';
import { PaymentKernel } from '../di/PaymentKernel';

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

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures/smoneyPayments`);
nockBack.setMode('record');

describe('Test suite for p2p', () => {
  let odbP2PRepository: TagRepositoryRead;
  let kernel: PaymentKernel;
  let processPayment: CreateP2P;

  beforeAll(async () => {
    const { nockDone } = await nockBack('getAccessToken.json', { before });
    odbP2PRepository = new OdbP2PRepositoryRead();
    kernel = await initializePaymentKernel({ useAzure: true });
    processPayment = kernel.get(CreateP2P);
    nockDone();
  });

  afterAll(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('should find tag with ref', async () => {
    const result = await odbP2PRepository.getByRef(1);
    expect(result.productCode).toEqual('DF003');
    expect(result.ref).toEqual(1);
  });

  it('Should throw error cause ref not found', async () => {
    const result = () => odbP2PRepository.getByRef(550000);
    expect(result).toThrowError(TagError.TagNotFound);
  });

  it('Should build tag with subscriptionMonthlyNumber', async () => {
    const { nockDone } = await nockBack('payment.json', { before });
    const { props } = await processPayment.execute({
      contractNumber: 'XMp6548787',
      amount: 77,
      senderId: 'mala_2',
      ref: 1,
      message: 'aze',
      recurency: new Recurrency({
        frequencyType: TransferFrequencyType.WEEKLY,
        endRecurrency: new Date('2020-10-20'),
      }),
    });
    expect(props.tag.buildTag()).toEqual(' -ECHEANCE3X        -DF003-FRA-001-XMp6548787');
    expect(props.tag.beneficiaryType).toEqual(BankAccountType.BANK_CREDIT_ACCOUNT);
    nockDone();
  });

  it('Should build tag with 000 and sender is BankCreditAccount', async () => {
    const { nockDone } = await nockBack('bankCreditAccount.json', { before });

    const result = await processPayment.execute({
      contractNumber: '875785785',
      amount: 5,
      senderId: 'mala_1',
      ref: 3,
      message: 'aze',
      recurency: new Recurrency({
        frequencyType: TransferFrequencyType.MONTHLY,
        endRecurrency: new Date('2020-09-25'),
      }),
    });
    expect(result.props.tag.buildTag()).toEqual(' -REMBOURSEMENT3X   -DF003-FRA-000-875785785');
    expect(result.props.tag.senderType).toEqual(BankAccountType.BANK_CREDIT_ACCOUNT);
    nockDone();
  });

  it('Should build tag with 000 and sender is BANK_AUTOBALANCE_ACCOUNT', async () => {
    const { nockDone } = await nockBack('paymentFinance.json', { before });

    const { props } = await processPayment.execute({
      contractNumber: 'XMp6548787',
      amount: 77,
      senderId: 'mala_1',
      ref: 11,
      message: 'aze',
      recurency: new Recurrency({
        frequencyType: TransferFrequencyType.WEEKLY,
        endRecurrency: new Date('2020-09-25'),
      }),
    });

    expect(props.tag.buildTag()).toEqual(' -FINANCEMENT AUTBA -AUTBA-FRA-000-XMp6548787');
    expect(props.tag.senderType).toEqual(BankAccountType.BANK_AUTOBALANCE_ACCOUNT);
    nockDone();
  });

  it('Should send p2p without recurrency', async () => {
    const { nockDone } = await nockBack('paymentFinanceWithoutRecurrency.json', { before });

    const { props } = await processPayment.execute({
      contractNumber: 'XMp6548787',
      amount: 77,
      senderId: 'mala_1',
      ref: 11,
      message: 'aze',
      recurency: null,
    });

    expect(props.tag.buildTag()).toEqual(' -FINANCEMENT AUTBA -AUTBA-FRA-000-XMp6548787');
    expect(props.tag.senderType).toEqual(BankAccountType.BANK_AUTOBALANCE_ACCOUNT);
    nockDone();
  });

  it('Should build tag with 000 and beneficiary is BANK_CreditAccount', async () => {
    const { nockDone } = await nockBack('bankBillingAccounts.json', { before });
    const { props } = await processPayment.execute({
      contractNumber: 'XMp6548787',
      amount: 50,
      senderId: 'mala_1',
      message: 'aze',
      ref: 10,
      recurency: new Recurrency({
        frequencyType: TransferFrequencyType.MONTHLY,
        endRecurrency: new Date('2020-09-25'),
      }),
    });

    expect(props.tag.buildTag()).toEqual(' -DEFINANCMENT4X    -DF004-FRA-000-XMp6548787');
    expect(props.tag.beneficiaryType).toEqual(BankAccountType.BANK_CREDIT_ACCOUNT);
    nockDone();
  });

  it('Should send money to another user account and throw error cause beneficiaryId is not defined', async () => {
    const result = processPayment.execute({
      contractNumber: 'XMp6548787',
      amount: 50,
      senderId: 'mala_1',
      ref: 36,
      message: 'aze',
      recurency: null,
    });
    await expect(result).rejects.toThrow(PaymentError.MissingBeneficiaryId);
  });

  it('Should send money to another user account', async () => {
    const { nockDone } = await nockBack('oneytooney.json', { before });
    const { props } = await processPayment.execute({
      contractNumber: 'XMp6548787',
      amount: 50,
      message: 'aze',
      senderId: 'mala_2',
      ref: 36,
      beneficiaryId: 'mala_1',
      recurency: new Recurrency({
        frequencyType: TransferFrequencyType.WEEKLY,
        endRecurrency: new Date('2020-09-25'),
      }),
    });
    expect(props.beneficiary.id).toEqual('1490');
    expect(props.sender.id).toEqual('1500');
    nockDone();
  });

  it('endRecurrency could not be today', () => {
    const result = () =>
      new Recurrency({
        frequencyType: 5,
        endRecurrency: new Date(),
      });
    expect(result).toThrow(PaymentError.PaymentReccurentNotValid);
  });

  it('Should send P2P for a loss', async () => {
    const { nockDone } = await nockBack('paymentLoss.json', { before });

    const { props } = await processPayment.execute({
      contractNumber: 'XMp6548787',
      amount: 10,
      senderId: 'mala_1',
      ref: 66,
      message: 'aze',
      recurency: null,
    });

    expect(props.tag.buildTag()).toEqual(' -PASS PERTE IMPAYE -IMPAY-FRA-000-XMp6548787');
    expect(props.tag.senderType).toEqual(BankAccountType.LOSS_ACCOUNT);
    expect(props.tag.beneficiaryType).toEqual(BankAccountType.COVER_ACCOUNT);
    nockDone();
  });

  describe('P2P error handling', () => {
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

    it('Should handle NotAuthorized', async () => {
      const result = processPayment.execute({
        orderId: 'EAFFCE13130',
        contractNumber: 'XMp6548787',
        amount: 50,
        senderId: 'mala_1',
        beneficiaryId: 'mala_1',
        ref: 36,
        message: 'aze',
        recurency: null,
      });

      await expect(result).rejects.toThrow(P2PErrors.NotAuthorized);
    });

    it('Should handle TokenExpired', async () => {
      const result = processPayment.execute({
        orderId: 'EAFFCE13130',
        contractNumber: 'XMp6548787',
        amount: 50,
        senderId: 'mala_1',
        beneficiaryId: 'mala_1',
        ref: 36,
        message: 'aze',
        recurency: null,
      });

      await expect(result).rejects.toThrow(P2PErrors.TokenExpired);
    });

    it('Should handle InvalidToken', async () => {
      const result = processPayment.execute({
        orderId: 'EAFFCE13130',
        contractNumber: 'XMp6548787',
        amount: 50,
        senderId: 'mala_1',
        beneficiaryId: 'mala_1',
        ref: 36,
        message: 'aze',
        recurency: null,
      });

      await expect(result).rejects.toThrow(P2PErrors.InvalidToken);
    });

    it('Should handle MissingParameters', async () => {
      const result = processPayment.execute({
        orderId: 'EAFFCE13130',
        contractNumber: 'XMp6548787',
        amount: 50,
        senderId: 'mala_1',
        beneficiaryId: 'mala_1',
        ref: 36,
        message: 'aze',
        recurency: null,
      });

      await expect(result).rejects.toThrow(P2PErrors.MissingParameters);
    });

    it('Should handle BadParameters', async () => {
      const result = processPayment.execute({
        orderId: 'EAFFCE13130',
        contractNumber: 'XMp6548787',
        amount: 50,
        senderId: 'mala_1',
        beneficiaryId: 'mala_1',
        ref: 36,
        message: 'aze',
        recurency: null,
      });

      await expect(result).rejects.toThrow(P2PErrors.BadParameters);
    });

    it('Should handle second BadParameters', async () => {
      const result = processPayment.execute({
        orderId: 'EAFFCE13130',
        contractNumber: 'XMp6548787',
        amount: 50,
        senderId: 'mala_1',
        beneficiaryId: 'mala_1',
        ref: 36,
        message: 'aze',
        recurency: null,
      });

      await expect(result).rejects.toThrow(P2PErrors.BadParameters);
    });

    it('Should handle SenderDoesNotExist', async () => {
      const result = processPayment.execute({
        orderId: 'EAFFCE13130',
        contractNumber: 'XMp6548787',
        amount: 50,
        senderId: 'mala_1',
        beneficiaryId: 'mala_1',
        ref: 36,
        message: 'aze',
        recurency: null,
      });

      await expect(result).rejects.toThrow(P2PErrors.SenderDoesNotExist);
    });

    it('Should handle SenderAccountBlocked', async () => {
      const result = processPayment.execute({
        orderId: 'EAFFCE13130',
        contractNumber: 'XMp6548787',
        amount: 50,
        senderId: 'mala_1',
        beneficiaryId: 'mala_1',
        ref: 36,
        message: 'aze',
        recurency: null,
      });

      await expect(result).rejects.toThrow(P2PErrors.SenderAccountBlocked);
    });

    it('Should handle SenderCantCreateP2P', async () => {
      const result = processPayment.execute({
        orderId: 'EAFFCE13130',
        contractNumber: 'XMp6548787',
        amount: 50,
        senderId: 'mala_1',
        beneficiaryId: 'mala_1',
        ref: 36,
        message: 'aze',
        recurency: null,
      });

      await expect(result).rejects.toThrow(P2PErrors.SenderCantCreateP2P);
    });

    it('Should handle CantSendToYourself', async () => {
      const result = processPayment.execute({
        orderId: 'EAFFCE13130',
        contractNumber: 'XMp6548787',
        amount: 50,
        senderId: 'mala_1',
        beneficiaryId: 'mala_1',
        ref: 36,
        message: 'aze',
        recurency: null,
      });

      await expect(result).rejects.toThrow(P2PErrors.CantSendToYourself);
    });

    it('Should handle IncompleteBeneficiary', async () => {
      const result = processPayment.execute({
        orderId: 'EAFFCE13130',
        contractNumber: 'XMp6548787',
        amount: 50,
        senderId: 'mala_1',
        beneficiaryId: 'mala_1',
        ref: 36,
        message: 'aze',
        recurency: null,
      });

      await expect(result).rejects.toThrow(P2PErrors.IncompleteBeneficiary);
    });

    it('Should handle second IncompleteBeneficiary', async () => {
      const result = processPayment.execute({
        orderId: 'EAFFCE13130',
        contractNumber: 'XMp6548787',
        amount: 50,
        senderId: 'mala_1',
        beneficiaryId: 'mala_1',
        ref: 36,
        message: 'aze',
        recurency: null,
      });

      await expect(result).rejects.toThrow(P2PErrors.IncompleteBeneficiary);
    });

    it('Should handle InsufficientBalance', async () => {
      const result = processPayment.execute({
        orderId: 'EAFFCE13130',
        contractNumber: 'XMp6548787',
        amount: 50,
        senderId: 'mala_1',
        beneficiaryId: 'mala_1',
        ref: 36,
        message: 'aze',
        recurency: null,
      });

      await expect(result).rejects.toThrow(P2PErrors.InsufficientBalance);
    });

    it('Should handle NonBankCustomerOperationsLimitsReached', async () => {
      const result = processPayment.execute({
        orderId: 'EAFFCE13130',
        contractNumber: 'XMp6548787',
        amount: 50,
        senderId: 'mala_1',
        beneficiaryId: 'mala_1',
        ref: 36,
        message: 'aze',
        recurency: null,
      });

      await expect(result).rejects.toThrow(P2PErrors.NonBankCustomerOperationsLimitsReached);
    });

    it('Should handle UncappedCustomerOperationsLimitsReached', async () => {
      const result = processPayment.execute({
        orderId: 'EAFFCE13130',
        contractNumber: 'XMp6548787',
        amount: 50,
        senderId: 'mala_1',
        beneficiaryId: 'mala_1',
        ref: 36,
        message: 'aze',
        recurency: null,
      });

      await expect(result).rejects.toThrow(P2PErrors.UncappedCustomerOperationsLimitsReached);
    });

    it('Should handle CappedCustomerOperationsLimitsReached', async () => {
      const result = processPayment.execute({
        orderId: 'EAFFCE13130',
        contractNumber: 'XMp6548787',
        amount: 50,
        senderId: 'mala_1',
        beneficiaryId: 'mala_1',
        ref: 36,
        message: 'aze',
        recurency: null,
      });

      await expect(result).rejects.toThrow(P2PErrors.CappedCustomerOperationsLimitsReached);
    });

    it('Should handle P2PAlreadyExists', async () => {
      const result = processPayment.execute({
        orderId: 'EAFFCE13130',
        contractNumber: 'XMp6548787',
        amount: 50,
        senderId: 'mala_1',
        beneficiaryId: 'mala_1',
        ref: 36,
        message: 'aze',
        recurency: null,
      });

      await expect(result).rejects.toThrow(P2PErrors.P2PAlreadyExists);
    });

    it('Should handle CustomerOperationsLimitsReached', async () => {
      const result = processPayment.execute({
        orderId: 'EAFFCE13130',
        contractNumber: 'XMp6548787',
        amount: 50,
        senderId: 'mala_1',
        beneficiaryId: 'mala_1',
        ref: 36,
        message: 'aze',
        recurency: null,
      });

      await expect(result).rejects.toThrow(P2PErrors.CustomerOperationsLimitsReached);
    });

    it('Should handle AnnualLimitReached', async () => {
      const result = processPayment.execute({
        orderId: 'EAFFCE13130',
        contractNumber: 'XMp6548787',
        amount: 50,
        senderId: 'mala_1',
        beneficiaryId: 'mala_1',
        ref: 36,
        message: 'aze',
        recurency: null,
      });

      await expect(result).rejects.toThrow(P2PErrors.AnnualLimitReached);
    });

    it('Should handle BadParameters', async () => {
      const result = processPayment.execute({
        orderId: 'EAFFCE13130',
        contractNumber: 'XMp6548787',
        amount: 50,
        senderId: 'mala_1',
        beneficiaryId: 'mala_1',
        ref: 36,
        message: 'aze',
        recurency: null,
      });

      await expect(result).rejects.toThrow(P2PErrors.BadParameters);
    });

    it('Should handle IncompleteBeneficiary', async () => {
      const result = processPayment.execute({
        orderId: 'EAFFCE13130',
        contractNumber: 'XMp6548787',
        amount: 50,
        senderId: 'mala_1',
        beneficiaryId: 'mala_1',
        ref: 36,
        message: 'aze',
        recurency: null,
      });

      await expect(result).rejects.toThrow(P2PErrors.IncompleteBeneficiary);
    });

    it('Should handle UnknownError', async () => {
      const result = processPayment.execute({
        orderId: 'EAFFCE13130',
        contractNumber: 'XMp6548787',
        amount: 50,
        senderId: 'mala_1',
        beneficiaryId: 'mala_1',
        ref: 36,
        message: 'aze',
        recurency: null,
      });

      await expect(result).rejects.toThrow(P2PErrors.UnknownError);
    });

    it('Should handle UnknownError for bad formated smo error', async () => {
      const result = processPayment.execute({
        orderId: 'EAFFCE13130',
        contractNumber: 'XMp6548787',
        amount: 50,
        senderId: 'mala_1',
        beneficiaryId: 'mala_1',
        ref: 36,
        message: 'aze',
        recurency: null,
      });

      await expect(result).rejects.toThrow(P2PErrors.UnknownError);
    });
  });
});
