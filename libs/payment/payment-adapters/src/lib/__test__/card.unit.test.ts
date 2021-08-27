/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { ServiceBusClient } from '@azure/service-bus';
import {
  BankAccountError,
  CardError,
  CardPreferences,
  CardStatus,
  CreateCard,
  GetCard,
  GetCards,
  NetworkError,
  OrderCardError,
  PaymentIdentifier,
  UpdateCard,
  UpdateCardStatus,
  WriteService,
} from '@oney/payment-core';
import {
  CardStatusUpdateReceived,
  CardType,
  EventActionCodes,
  EventActionCodesKey,
  EventCallbackTypes,
  EventCallbackTypesKey,
  EventCardStatuses,
  EventCardStatusesKey,
  EventCardTypes,
  EventCardTypesKey,
  EventOpposedReason,
  EventOpposedReasonKey,
} from '@oney/payment-messages';
import * as nock from 'nock';
import { defaultLogger } from '@oney/logger-adapters';
import { OfferType, OrderCard } from '@oney/subscription-messages';
import * as path from 'path';
import * as queryString from 'querystring';
import { naruto } from './fixtures/config/naruto';
import { initializePaymentKernel } from './fixtures/initializePaymentKernel';
import { expectedErrorCreationCard, expectedErrorUpdateCard } from './fixtures/smoneyCards/getCardsExpect';
import { CardStatusUpdateReceivedEventHandler } from '../adapters/handlers/card/CardStatusUpdateReceivedEventHandler';
import { PaymentKernel } from '../di/PaymentKernel';
import { OrderCardHandler } from '../adapters/handlers/card/OrderCardHandler';

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
      createSubscriptionClient: jest.fn().mockReturnValue({
        createReceiver: jest.fn().mockReturnValue({
          registerMessageHandler: jest.fn(),
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
nockBack.fixtures = path.resolve(`${__dirname}/fixtures/smoneyCards`);
nockBack.setMode('record');

describe('Test suite for cards', () => {
  let kernel: PaymentKernel;
  let getCard: GetCard;
  let getCards: GetCards;
  let updateCard: UpdateCard;
  let updateCardStatus: UpdateCardStatus;
  let createCard: CreateCard;
  let writeService: WriteService;
  let mockyBankAccount;
  let noCardsMockyBankAccount;
  let unsynchronizedMockyBankAccount;
  let mockBusSend: jest.Mock;

  beforeAll(async () => {
    const { nockDone } = await nockBack('getAccessToken.json', { before });
    mockBusSend = (ServiceBusClient.createFromConnectionString(null).createTopicClient(null).createSender()
      .send as unknown) as jest.Mock;

    kernel = await initializePaymentKernel({ useAzure: true });

    kernel.bind(OrderCardHandler).to(OrderCardHandler);

    await kernel.initSubscribers();

    getCard = kernel.get(GetCard);
    getCards = kernel.get(GetCards);
    createCard = kernel.get(CreateCard);
    updateCard = kernel.get(UpdateCard);
    updateCardStatus = kernel.get(UpdateCardStatus);
    nockDone();
  });

  beforeEach(async () => {
    mockBusSend.mockClear();
    mockyBankAccount = {
      _id: '5f7c6ff44d0bca0013e5d982',
      uid: 'zCDOH_UvA',
      bid: '2520',
      iban: 'FR0612869000020PC000001Y059',
      bic: 'SMOEFRP1',
      cards: [
        {
          _id: '5f9fd9d2e0910d0013d42c18',
          cid: 'card-BjHjzuN5V',
          pan: '9396XXXXXXXX2549',
          status: 2,
          cardType: 2,
          blocked: false,
          foreignPayment: true,
          internetPayment: true,
          atmWeeklyAllowance: 300,
          atmWeeklyUsedAllowance: 10,
          monthlyAllowance: 1000,
          monthlyUsedAllowance: 389,
          hasPin: false,
          uniqueId: '1286900002JkUHA0eMj0emobEJBodlhg',
        },
      ],
      beneficiaries: [],
    };
    unsynchronizedMockyBankAccount = {
      _id: '5fbe21a55674da0019ca047b',
      uid: 'wuoZnHZm_',
      bid: '3318',
      iban: 'FR3112869000020PC000002K618',
      bic: 'BACCFR23',
      cards: [],
      beneficiaries: [],
    };
    noCardsMockyBankAccount = {
      _id: '5f7c6ff44d0bca0013e5d990',
      uid: 'rHZoIXcgy',
      bid: '2521',
      iban: 'FR0612869000020PC000001Y060',
      bic: 'SMOEFRP1',
      cards: [],
      beneficiaries: [],
    };
    writeService = kernel.get<WriteService>(PaymentIdentifier.accountManagementWriteService);
    await writeService.upsert({ cid: mockyBankAccount.cards[0].cid }, mockyBankAccount);
    await writeService.upsert({ uid: mockyBankAccount.uid }, mockyBankAccount);
    await writeService.upsert({ uid: noCardsMockyBankAccount.uid }, noCardsMockyBankAccount);
    await writeService.upsert({ uid: unsynchronizedMockyBankAccount.uid }, unsynchronizedMockyBankAccount);
  });

  afterEach(async () => {
    await writeService.clear();
  });

  afterAll(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  describe('Get single card', () => {
    it('Should find a card', async () => {
      const card = await getCard.execute({
        accountId: 'zCDOH_UvA',
        cardId: 'card-BjHjzuN5V',
      });
      expect(card).toEqual({
        id: 'card-BjHjzuN5V',
        ref: '1286900002JkUHA0eMj0emobEJBodlhg',
        ownerId: 'zCDOH_UvA',
        pan: '9396XXXXXXXX2549',
        hasPin: false,
        status: 'activated',
        type: 'physical_classic',
        preferences: new CardPreferences({
          blocked: false,
          foreignPayment: true,
          internetPayment: true,
          atmWeeklyAllowance: 300,
          atmWeeklyUsedAllowance: 10,
          monthlyAllowance: 1000,
          monthlyUsedAllowance: 389,
        }),
      });
    });

    it('Should fail to find a card', async () => {
      const getCardPromise = getCard.execute({
        accountId: 'zCDOH_UvA',
        cardId: 'dummy_card',
      });
      await expect(getCardPromise).rejects.toEqual(new CardError.CardNotFound('dummy_card'));
    });
  });

  describe('Get all cards', () => {
    it('Should find all cards for an account', async () => {
      const cards = await getCards.execute({
        accountId: 'zCDOH_UvA',
      });

      expect(cards).toEqual([
        {
          id: 'card-BjHjzuN5V',
          ref: '1286900002JkUHA0eMj0emobEJBodlhg',
          ownerId: 'zCDOH_UvA',
          pan: '9396XXXXXXXX2549',
          hasPin: false,
          status: 'activated',
          type: 'physical_classic',
          preferences: new CardPreferences({
            blocked: false,
            foreignPayment: true,
            internetPayment: true,
            atmWeeklyAllowance: 300,
            atmWeeklyUsedAllowance: 10,
            monthlyAllowance: 1000,
            monthlyUsedAllowance: 389,
          }),
        },
      ]);
    });

    it('Should find no cards for an account if the account has created no cards', async () => {
      const cards = await getCards.execute({
        accountId: 'rHZoIXcgy',
      });

      expect(cards).toEqual([]);
    });

    it('Should throw if the user does not exist', async () => {
      const getCardsPromise = getCards.execute({
        accountId: 'dummy_account',
      });

      expect(getCardsPromise).rejects.toThrow(new CardError.UserNotFound('USER_NOT_FOUND'));
    });
  });

  describe('update card', () => {
    it('Should update a card', async () => {
      const { nockDone } = await nockBack('updateCard.json', { before });
      const card = await updateCard.execute({
        accountId: 'zCDOH_UvA',
        cardId: 'card-BjHjzuN5V',
        hasPin: false,
        preferences: {
          blocked: false,
          foreignPayment: true,
          internetPayment: true,
          atmWeeklyAllowance: 250,
          monthlyAllowance: 850,
        },
      });
      expect(card).toEqual({
        id: 'card-BjHjzuN5V',
        ref: '1286900002JkUHA0eMj0emobEJBodlhg',
        ownerId: 'zCDOH_UvA',
        pan: '9396XXXXXXXX2549',
        hasPin: false,
        status: 'activated',
        type: 'physical_classic',
        preferences: new CardPreferences({
          blocked: false,
          foreignPayment: true,
          internetPayment: true,
          atmWeeklyAllowance: 250,
          atmWeeklyUsedAllowance: 10,
          monthlyAllowance: 850,
          monthlyUsedAllowance: 389,
        }),
      });
      nockDone();
    });

    it('Should update a card with only blocked parameter', async () => {
      const { nockDone } = await nockBack('updateCardBlocked.json', { before });
      const card = await updateCard.execute({
        accountId: 'zCDOH_UvA',
        cardId: 'card-BjHjzuN5V',
        hasPin: false,
        preferences: {
          blocked: true,
        },
      });
      expect(card).toEqual({
        id: 'card-BjHjzuN5V',
        ref: '1286900002JkUHA0eMj0emobEJBodlhg',
        ownerId: 'zCDOH_UvA',
        pan: '9396XXXXXXXX2549',
        hasPin: false,
        status: 'activated',
        type: 'physical_classic',
        preferences: new CardPreferences({
          blocked: true,
          foreignPayment: true,
          internetPayment: true,
          atmWeeklyAllowance: 300,
          atmWeeklyUsedAllowance: 10,
          monthlyAllowance: 1000,
          monthlyUsedAllowance: 389,
        }),
      });
      nockDone();
    });

    it('Should update a card with only foreignPayment parameter', async () => {
      const { nockDone } = await nockBack('updateCardForeignPayment.json', { before });
      const card = await updateCard.execute({
        accountId: 'zCDOH_UvA',
        cardId: 'card-BjHjzuN5V',
        hasPin: false,
        preferences: {
          foreignPayment: false,
        },
      });
      expect(card).toEqual({
        id: 'card-BjHjzuN5V',
        ref: '1286900002JkUHA0eMj0emobEJBodlhg',
        ownerId: 'zCDOH_UvA',
        pan: '9396XXXXXXXX2549',
        hasPin: false,
        status: 'activated',
        type: 'physical_classic',
        preferences: new CardPreferences({
          blocked: false,
          foreignPayment: false,
          internetPayment: true,
          atmWeeklyAllowance: 300,
          atmWeeklyUsedAllowance: 10,
          monthlyAllowance: 1000,
          monthlyUsedAllowance: 389,
        }),
      });
      nockDone();
    });

    it('Should update a card with only internetPayment parameter', async () => {
      const { nockDone } = await nockBack('updateCardInternetPayment.json', { before });
      const card = await updateCard.execute({
        accountId: 'zCDOH_UvA',
        cardId: 'card-BjHjzuN5V',
        hasPin: false,
        preferences: {
          internetPayment: false,
        },
      });
      expect(card).toEqual({
        id: 'card-BjHjzuN5V',
        ref: '1286900002JkUHA0eMj0emobEJBodlhg',
        ownerId: 'zCDOH_UvA',
        pan: '9396XXXXXXXX2549',
        hasPin: false,
        status: 'activated',
        type: 'physical_classic',
        preferences: new CardPreferences({
          blocked: false,
          foreignPayment: true,
          internetPayment: false,
          atmWeeklyAllowance: 300,
          atmWeeklyUsedAllowance: 10,
          monthlyAllowance: 1000,
          monthlyUsedAllowance: 389,
        }),
      });
      nockDone();
    });

    it('Should update a card with only atmWeeklyAllowance parameter', async () => {
      const { nockDone } = await nockBack('updateCardAtmWeeklyAllowance.json', { before });
      const card = await updateCard.execute({
        accountId: 'zCDOH_UvA',
        cardId: 'card-BjHjzuN5V',
        hasPin: false,
        preferences: {
          atmWeeklyAllowance: 200,
        },
      });
      expect(card).toEqual({
        id: 'card-BjHjzuN5V',
        ref: '1286900002JkUHA0eMj0emobEJBodlhg',
        ownerId: 'zCDOH_UvA',
        pan: '9396XXXXXXXX2549',
        hasPin: false,
        status: 'activated',
        type: 'physical_classic',
        preferences: new CardPreferences({
          blocked: false,
          foreignPayment: true,
          internetPayment: true,
          atmWeeklyAllowance: 200,
          atmWeeklyUsedAllowance: 10,
          monthlyAllowance: 1000,
          monthlyUsedAllowance: 389,
        }),
      });
      nockDone();
    });

    it('Should update a card with only monthlyAllowance parameter', async () => {
      const { nockDone } = await nockBack('updateCardMonthlyAllowance.json', { before });
      const card = await updateCard.execute({
        accountId: 'zCDOH_UvA',
        cardId: 'card-BjHjzuN5V',
        hasPin: false,
        preferences: {
          monthlyAllowance: 500,
        },
      });
      expect(card).toEqual({
        id: 'card-BjHjzuN5V',
        ref: '1286900002JkUHA0eMj0emobEJBodlhg',
        ownerId: 'zCDOH_UvA',
        pan: '9396XXXXXXXX2549',
        hasPin: false,
        status: 'activated',
        type: 'physical_classic',
        preferences: new CardPreferences({
          blocked: false,
          foreignPayment: true,
          internetPayment: true,
          atmWeeklyAllowance: 300,
          atmWeeklyUsedAllowance: 10,
          monthlyAllowance: 500,
          monthlyUsedAllowance: 389,
        }),
      });
      nockDone();
    });

    it('Should fail if the preferences are wrong', async () => {
      const error = new NetworkError.ApiResponseError('SMONEY_API_ERROR', expectedErrorUpdateCard);
      const { nockDone } = await nockBack('updateCardFail.json', { before });
      const getCardPromise = updateCard.execute({
        accountId: 'zCDOH_UvA',
        cardId: 'card-BjHjzuN5V',
        hasPin: false,
        preferences: {
          blocked: false,
          foreignPayment: true,
          internetPayment: true,
          atmWeeklyAllowance: 350000000,
          monthlyAllowance: 950,
        },
      });
      await expect(getCardPromise).rejects.toEqual(error);
      nockDone();
    });

    it('Should fail if the atm allowance is incorrect', async () => {
      const getCardPromise = updateCard.execute({
        accountId: 'zCDOH_UvA',
        cardId: 'card-BjHjzuN5V',
        hasPin: false,
        preferences: {
          blocked: false,
          foreignPayment: true,
          internetPayment: true,
          atmWeeklyAllowance: -1,
          monthlyAllowance: 950,
        },
      });
      await expect(getCardPromise).rejects.toThrow(CardError.InvalidAtmWeeklyAllowance);
    });

    it('Should fail if the monthly allowance is incorrect', async () => {
      const getCardPromise = updateCard.execute({
        accountId: 'zCDOH_UvA',
        cardId: 'card-BjHjzuN5V',
        hasPin: false,
        preferences: {
          blocked: false,
          foreignPayment: true,
          internetPayment: true,
          atmWeeklyAllowance: 250,
          monthlyAllowance: -1,
        },
      });
      await expect(getCardPromise).rejects.toEqual(
        new CardError.InvalidMonthlyAllowance('INVALID_MONTHLY_ALLOWANCE'),
      );
    });

    it('Should fail if the account management account does not exist', async () => {
      await writeService.clear();
      const { nockDone } = await nockBack('updateCardFail.json', { before });
      const getCardPromise = updateCard.execute({
        accountId: 'zCDOH_UvA',
        cardId: 'card-BjHjzuN5V',
        hasPin: false,
        preferences: {
          blocked: false,
          foreignPayment: true,
          internetPayment: true,
          atmWeeklyAllowance: 350000000,
          monthlyAllowance: 950,
        },
      });
      await expect(getCardPromise).rejects.toThrow(BankAccountError.BankAccountNotFound);
      nockDone();
    });

    it('should handle receiving CARD_STATUS_UPDATE_RECEIVED events', async () => {
      const { nockDone } = await nockBack('updateCardStatus.json', { before });
      const statusUpdated = new CardStatusUpdateReceived({
        id: '123',
        actionCode: EventActionCodes[EventActionCodes.CREATION] as EventActionCodesKey,
        cardType: EventCardTypes[EventCardTypes.CLASSIC_PHYSICAL] as EventCardTypesKey,
        date: new Date(),
        reference: 'card-BjHjzuN5V',
        status: EventCardStatuses[EventCardStatuses.ACTIVATED] as EventCardStatusesKey,
        type: EventCallbackTypes[EventCallbackTypes.CARD_LIFECYCLE] as EventCallbackTypesKey,
        opposedReason: EventOpposedReason[EventOpposedReason.NO_OPPOSITION] as EventOpposedReasonKey,
        userId: 'zCDOH_UvA',
      });

      const statusUpdatedHandler = new CardStatusUpdateReceivedEventHandler(updateCardStatus, defaultLogger);
      const spy = jest.spyOn(statusUpdatedHandler, 'handle');
      await statusUpdatedHandler.handle(statusUpdated);

      await expect(statusUpdated).toBeTruthy();
      await expect(spy).toHaveBeenCalledWith(statusUpdated);
      nockDone();
      spy.mockReset();
    });

    it('should update card when receiving CARD_STATUS_UPDATE_RECEIVED event', async () => {
      const { nockDone } = await nockBack('updateCardStatus.json', { before });
      const updatedCard = await updateCardStatus.execute({
        cardId: 'card-BjHjzuN5V',
        status: CardStatus.ACTIVATED,
        accountId: 'zCDOH_UvA',
      });

      await expect(updatedCard.props.status).toMatch(CardStatus.ACTIVATED);

      nockDone();
    });

    it('should fail to update card when receiving CARD_STATUS_UPDATE_RECEIVED event because card not exist', async () => {
      const updatedCardPromise = updateCardStatus.execute({
        cardId: 'card-x',
        status: CardStatus.ACTIVATED,
        accountId: 'zCDOH_UvA',
      });

      await expect(updatedCardPromise).rejects.toThrow(CardError.CardNotFound);
    });
  });

  describe('create card', () => {
    it('Should create a premier card', async () => {
      const { nockDone } = await nockBack('createPremierCard.json', { before });
      const card = await createCard.execute({
        accountId: 'zCDOH_UvA',
        cardType: CardType.PHYSICAL_PREMIER,
      });

      expect(card).toEqual({
        id: 'card-_ASRyUKBQ',
        ref: '1286900002Vng88wyULEismglwOnHYSA',
        ownerId: 'zCDOH_UvA',
        pan: '9396XXXXXXXX1163',
        type: CardType.PHYSICAL_PREMIER,
        status: CardStatus.SENT,
        hasPin: false,
        preferences: new CardPreferences({
          blocked: false,
          foreignPayment: true,
          internetPayment: true,
          atmWeeklyUsedAllowance: 0,
          monthlyUsedAllowance: 0,
          atmWeeklyAllowance: 500,
          monthlyAllowance: 5000,
        }),
      });
      nockDone();
    });

    it('Should handle OrderCard with Classic Card', async () => {
      const { nockDone } = await nockBack('createClassicCard.json', { before });
      await kernel.get(OrderCardHandler).handle(
        new OrderCard({
          offerType: OfferType.ONEY_ORIGINAL,
          subscriberId: 'zCDOH_UvA',
        }),
      );
      await nockDone();
    });

    it('Should handle OrderCard command with Premier Card', async () => {
      const { nockDone } = await nockBack('createPremierCard.json', { before });
      await kernel.get(OrderCardHandler).handle(
        new OrderCard({
          offerType: OfferType.ONEY_FIRST,
          subscriberId: 'zCDOH_UvA',
        }),
      );
      await nockDone();
    });

    it('Should throw cause OfferType is not a valid one', async () => {
      const result = kernel.get(OrderCardHandler).handle(
        new OrderCard({
          offerType: OfferType.ACCOUNT_FEE,
          subscriberId: 'zCDOH_UvA',
        }),
      );
      await expect(result).rejects.toThrow(OrderCardError.OfferCantBeProcessed);
    });

    it('Should create a classic card', async () => {
      const { nockDone } = await nockBack('createClassicCard.json', { before });
      const card = await createCard.execute({
        accountId: 'zCDOH_UvA',
        cardType: CardType.PHYSICAL_CLASSIC,
      });

      expect(card).toEqual({
        id: 'card-UojzbeMuR',
        ref: '1286900002wQel8z6Xn0yZspnpqEdjkg',
        ownerId: 'zCDOH_UvA',
        pan: '9396XXXXXXXX7375',
        type: CardType.PHYSICAL_CLASSIC,
        status: CardStatus.SENT,
        hasPin: false,
        preferences: new CardPreferences({
          blocked: false,
          foreignPayment: true,
          internetPayment: true,
          atmWeeklyUsedAllowance: 0,
          monthlyUsedAllowance: 0,
          atmWeeklyAllowance: 300,
          monthlyAllowance: 3000,
        }),
      });
      nockDone();
    });

    /*  it('Should dispatch a domain event on card creation', async () => {
      const { nockDone } = await nockBack('createClassicCard.json', { before });
      await createCard.execute({
        accountId: 'zCDOH_UvA',
        cardType: CardType.PHYSICAL_CLASSIC,
      });

      expect(mockBusSend).toHaveBeenCalledWith(cardsDomainEventsExpect.cardCreated);
      nockDone();
    });*/

    it('Should fail to create an existing card', async () => {
      const { nockDone } = await nockBack('createExistingCardFail.json', { before });
      const error = new NetworkError.ApiResponseError('SMONEY_API_ERROR', expectedErrorCreationCard);
      const getCardPromise = createCard.execute({
        accountId: 'zCDOH_UvA',
        cardType: CardType.PHYSICAL_PREMIER,
      });
      await expect(getCardPromise).rejects.toEqual(error);
      nockDone();
    });

    it('Should fail if the account does not exist', async () => {
      const { nockDone } = await nockBack('bankAccountNotFoundCardFail.json', { before });
      const getCardPromise = createCard.execute({
        accountId: 'dummy_account',
        cardType: CardType.PHYSICAL_PREMIER,
      });
      await expect(getCardPromise).rejects.toEqual(
        new BankAccountError.BankAccountNotFound('BANK_ACCOUNT_NOT_FOUND'),
      );
      nockDone();
    });
  });
});
