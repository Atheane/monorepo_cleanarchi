/**
 * @jest-environment node
 */
import { ClassType } from '@oney/common-core';
import { defaultLogger } from '@oney/logger-adapters';
import { EventDispatcher } from '@oney/messages-core';
import { PaymentKernel } from '@oney/payment-adapters';
import {
  CalculateBankAccountExposure,
  CreateCOP,
  CreateSDD,
  LegacyBankAccount,
  PaymentIdentifier,
  QueryService,
  UncappingState,
  WriteService,
  CreateClearing,
} from '@oney/payment-core';
import { ClearingOperationReceived, COPReceived, SDDReceived } from '@oney/payment-messages';
import MockDate from 'mockdate';
import * as nock from 'nock';
import * as path from 'path';
import 'reflect-metadata';
import { initializePaymentKernel } from './fixtures/initializePaymentKernel';
import {
  clearingCreatedDomainEvent,
  clearingCreatedWithoutMerchantAndAmountDomainEvent,
  copCreatedDomainEvent,
  differentCopCreatedDomainEvent,
  sddCreatedDomainEvent,
} from './fixtures/smoneyOperations/operations.fixtures';
import { COPReceivedEventHandler } from '../adapters/handlers/operation/COPReceivedEventHandler';
import { SDDReceivedEventHandler } from '../adapters/handlers/operation/SDDReceivedEventHandler';
import { ClearingOperationReceivedEventHandler } from '../adapters/handlers/operation/ClearingOperationReceivedEventHandler';

jest.mock('uuid', () => ({
  v4: () => 'uuid_v4_example',
}));

jest.mock('short-unique-id', () => ({
  default: class MockShortUnitId extends Function {
    constructor() {
      super();
      const self = this.bind(this);
      return self;
    }

    randomUUID() {
      return 'short_unique_id_mock';
    }
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

describe('Operations unit testing', () => {
  let kernel: PaymentKernel;
  let createSDD: CreateSDD;
  let createCOP: CreateCOP;
  let createClearing: CreateClearing;
  let synchronizeBankAccountExposure: CalculateBankAccountExposure;
  let saveFixture: Function;
  let writeService: WriteService;
  let queryService: QueryService;
  let aBankAccount: LegacyBankAccount;
  let spyOn_dispatch;
  const disablingUsecaseExecutionDuringHandler = <T>(usecase: ClassType<T>) =>
    (usecase.prototype.execute = jest.fn());

  beforeAll(async () => {
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/smoneyOperations`);
    nock.back.setMode('record');
    const { nockDone } = await nock.back('getAccessToken.json');

    kernel = await initializePaymentKernel({ useAzure: false });

    createSDD = kernel.get(CreateSDD);
    createCOP = kernel.get(CreateCOP);
    createClearing = kernel.get(CreateClearing);
    writeService = kernel.get<WriteService>(PaymentIdentifier.accountManagementWriteService);
    queryService = kernel.get<QueryService>(PaymentIdentifier.transactionQueryService);
    synchronizeBankAccountExposure = kernel.get(CalculateBankAccountExposure);
    aBankAccount = {
      uid: 'a96035cbJ',
      bid: '2520',
      iban: 'FR0612869000020PC000001Y059',
      bic: 'SMOEFRP1',
      beneficiaries: [],
      cards: [],
      monthlyAllowance: {
        remainingFundToSpend: 1000,
        authorizedAllowance: 1000,
      },
      uncappingState: UncappingState.CAPPED,
      productsEligibility: {
        account: false,
        splitPayment: true,
      },
    };
    await writeService.upsert({ uid: aBankAccount.uid }, aBankAccount);
    nockDone();
  });

  beforeEach(async () => {
    MockDate.set(new Date('2020-12-10T00:00:00.000Z'));
    nock.restore();
    nock.activate();
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

  describe('SDD', () => {
    afterAll(() => {
      jest.clearAllMocks();
    });

    it('Should get sdd and send a SDDCreated event though createSDD usecase', async () => {
      const operation = await createSDD.execute({
        id: '8939',
        reference: 'S-MONEY-20210105110100000113',
        type: '19',
        status: '2',
        userid: 'a96035cbJ',
      });

      expect(spyOn_dispatch).toHaveBeenCalledWith(sddCreatedDomainEvent);
      expect(await queryService.findOne({ orderId: operation.props.orderId })).toEqual(operation.props);
    });

    it('Should get sdd and send a SDDCreated event though SDDReceived event handler', async () => {
      disablingUsecaseExecutionDuringHandler<CalculateBankAccountExposure>(CalculateBankAccountExposure);
      await new SDDReceivedEventHandler(createSDD, synchronizeBankAccountExposure, defaultLogger).handle(
        new SDDReceived({
          id: '8939',
          reference: 'S-MONEY-20210105110100000113',
          type: '19',
          status: '2',
          userid: 'a96035cbJ',
        }),
      );

      expect(spyOn_dispatch).toBeCalledWith(sddCreatedDomainEvent);
    });
  });

  describe('COP', () => {
    it('Should get a card operation and send a COPCreated event though createCOP usecase', async () => {
      const operation = await createCOP.execute({
        id: '9131',
        reference: 'Js0ThVo6F0euKlv1QK5Ebg',
        type: '20',
        transactionAmount: '5',
        currencyCodeTransaction: '978',
        cardHolderBillingAmount: '',
        cardHolderBillingConversionRate: '',
        availableBalance: '-1009.56',
        actionCode: '116',
        merchantType: '5812',
        cardAcceptorIdentificationCodeName: 'Chez Francette\\\\Paris 11',
        status: '3',
        userId: 'a96035cbJ',
      });

      expect(spyOn_dispatch).toHaveBeenCalledWith(copCreatedDomainEvent);
      expect(await queryService.findOne({ orderId: operation.props.orderId })).toEqual(operation.props);
    });

    it('Should get a card operation and send a COPCreated event though createCOP usecase with different data', async () => {
      const operation = await createCOP.execute({
        id: '9131',
        reference: 'Js0ThVo6F0euKlv1QK5Ebg',
        type: '20',
        transactionAmount: '',
        currencyCodeTransaction: '978',
        cardHolderBillingAmount: '3',
        cardHolderBillingConversionRate: '0.5',
        availableBalance: '-1009.56',
        actionCode: '116',
        merchantType: '5812',
        cardAcceptorIdentificationCodeName: '',
        status: '3',
        userId: 'a96035cbJ',
      });

      expect(spyOn_dispatch).toHaveBeenCalledWith(differentCopCreatedDomainEvent);
      expect(await queryService.findOne({ orderId: operation.props.orderId })).toEqual(operation.props);
    });

    it('Should get a card operation and send a COPCreated event though COPReceived event handler', async () => {
      disablingUsecaseExecutionDuringHandler<CalculateBankAccountExposure>(CalculateBankAccountExposure);
      await new COPReceivedEventHandler(createCOP, synchronizeBankAccountExposure, defaultLogger).handle(
        new COPReceived({
          id: '9131',
          reference: 'Js0ThVo6F0euKlv1QK5Ebg',
          type: '20',
          transactionAmount: '5',
          currencyCodeTransaction: '978',
          cardHolderBillingAmount: '',
          cardHolderBillingConversionRate: '',
          availableBalance: '-1009.56',
          actionCode: '116',
          merchantType: '5812',
          cardAcceptorIdentificationCodeName: 'Chez Francette\\\\Paris 11',
          status: '3',
          userId: 'a96035cbJ',
        }),
      );

      expect(spyOn_dispatch).toHaveBeenCalledWith(copCreatedDomainEvent);
    });
  });

  describe('Clearing', () => {
    it('Should process a clearing though the usecase', async () => {
      const operation = await createClearing.execute({
        reference: 'Js0ThVo6F0euKlv1QK5Ebg',
        originalAmount: 2000,
        amount: 2000,
        financialNetworkCode: 3,
        exchangeRate: 1,
        currency: '978',
        status: 1,
        type: 504,
        cardId: 'DEBTTEST1-CP1',
        merchant: {
          street: 'Rue Oberkampf',
          city: 'Paris 11',
          categoryCode: 5812,
          name: 'Chez Francette',
        },
      });

      expect(spyOn_dispatch).toHaveBeenCalledWith(clearingCreatedDomainEvent);
      expect(await queryService.findOne({ orderId: operation.props.orderId })).toEqual(operation.props);
    });

    it('Should process a clearing with trigram currency', async () => {
      const operation = await createClearing.execute({
        reference: 'Js0ThVo6F0euKlv1QK5Ebg',
        originalAmount: 2000,
        amount: 2000,
        financialNetworkCode: 3,
        exchangeRate: 1,
        currency: 'EUR',
        status: 1,
        type: 504,
        cardId: 'DEBTTEST1-CP1',
        merchant: {
          street: 'Rue Oberkampf',
          city: 'Paris 11',
          categoryCode: 5812,
          name: 'Chez Francette',
        },
      });

      expect(spyOn_dispatch).toHaveBeenCalledWith(clearingCreatedDomainEvent);
      expect(await queryService.findOne({ orderId: operation.props.orderId })).toEqual(operation.props);
    });

    it('Should process a clearing though the usecase without merchant and amounts information', async () => {
      const operation = await createClearing.execute({
        reference: 'Js0ThVo6F0euKlv1QK5Ebg',
        originalAmount: null,
        amount: null,
        financialNetworkCode: 3,
        exchangeRate: 1,
        currency: '978',
        status: 1,
        type: 504,
        cardId: 'DEBTTEST1-CP1',
        merchant: {
          street: null,
          city: null,
          categoryCode: 5812,
          name: 'Chez Francette',
        },
      });

      expect(spyOn_dispatch).toHaveBeenCalledWith(clearingCreatedWithoutMerchantAndAmountDomainEvent);
      expect(await queryService.findOne({ orderId: operation.props.orderId })).toEqual(operation.props);
    });

    it('Should process a clearing though the clearing operation event handler', async () => {
      disablingUsecaseExecutionDuringHandler<CalculateBankAccountExposure>(CalculateBankAccountExposure);
      await new ClearingOperationReceivedEventHandler(
        createClearing,
        synchronizeBankAccountExposure,
        defaultLogger,
      ).handle(
        new ClearingOperationReceived({
          reference: 'Js0ThVo6F0euKlv1QK5Ebg',
          originalAmount: 2000,
          amount: 2000,
          financialNetworkCode: 3,
          exchangeRate: 1,
          currency: '978',
          status: 1,
          type: 504,
          cardId: 'DEBTTEST1-CP1',
          merchant: {
            street: '',
            city: 'Paris 11',
            categoryCode: 5812,
            name: 'Chez Francette',
          },
        }),
      );

      expect(spyOn_dispatch).toHaveBeenCalledWith(clearingCreatedDomainEvent);
    });
  });
});
