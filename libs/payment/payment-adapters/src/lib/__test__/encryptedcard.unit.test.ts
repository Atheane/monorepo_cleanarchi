/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { initRxMessagingPlugin } from '@oney/rx-events-adapters';
import * as nock from 'nock';
import MockDate from 'mockdate';
import { PaymentKernel } from '@oney/payment-adapters';
import {
  LegacyBankAccount,
  PaymentIdentifier,
  WriteService,
  UncappingState,
  DisplayCardDetails,
  CardError,
  DisplayCardPin,
  CardHmac,
} from '@oney/payment-core';
import * as path from 'path';
import { configuration, kvConfiguration } from './fixtures/config/Configuration';

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

describe('encrypted card unit testing', () => {
  let kernel: PaymentKernel;
  let displayCardDetails: DisplayCardDetails;
  let displayCardPin: DisplayCardPin;
  let cardHmac: CardHmac;
  let saveFixture: Function;
  let writeService: WriteService;
  let aBankAccount: LegacyBankAccount;
  let rsaPublicKey: string;

  beforeAll(async () => {
    rsaPublicKey =
      'LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQ0lqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FnOEFNSUlDQ2dLQ0FnRUE1YnQ3UzZvSy9kNldNdUZvQk9SNktKcnJyc1oxRWhtR3VIMnRMMkc4T1d6UmY4L1ltaHRxY3NXQWxIU3pQRHJUeDdxbktVUWRObFVHN1hGVEswanZoWnduazVpcVh6WEJsSElaakFHTklLcXFOcG5KSkt6SHYreUhPNGdFY3dEQVFtZUdSbVNkMVRkcGlhKzlSNUtKOEJsMFZPUSttb3FBTjhQL1ZnQUFla2d0U3ZqbHl1UURjTm9qVEFZVEp0RjRkYnR4YldJcHM3U3FPckFNUFJySmNGeUs5dzFSVUxKeElIQnFFdzJQYTRVVldFeUE0djRmYm44VGlNcjNpOU9MZURFdERnZElOLys5aHduRng2Wm5nZnBEK3IrQ210WS9yY0ljYUZBYWN3emJFaDBDdERCL1loVUh2c3lUeXU3SjZYN0xzaFU5dVdkMUJEWWwvNUwxK3o2QnRaQjgvaUtQT1lpMHNNM2tRZDNWUWh1QXFHaXJpOUZVZGNmeVNMM2NSRlc4di9Ma0tYL1JWL29NOW5RNmpNajZmd0pIcmdGYnNybU9JQVhyNXV4ZWxkUExJTlB2RVplRFBpVEx4TnlodUkyN1lMYnZZNFllbmtoek93ZkRSOS82dEFkWFJDSitraVBTUXUwa1hvbjByY1o5WlkxY1FZWDlUSUg2MUxJUnJMWEpHdGFuL1BYVnpnY1IvVXlGUXFXamJJVlIvZFVVdi9mUzRwWFUrUEp3TUNzdWZsQXlwbTFpOEJwVk5zejA1amw4RlV6T1ZQNUFUeTdQNkZNNlA0d1NjRHphWnpCaVkvSFU2Nm9mbVZJQ2p2M0d3dHkxTnYrVnhUdTQwSUsyZmo4NzZvNHduNU5Ma0swMCtFUEVZYjFrYUFvRExkV290dnNhOU9QdHdpRUNBd0VBQVE9PQotLS0tLUVORCBQVUJMSUMgS0VZLS0tLS0=';
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/smoneyEncryptedCard`);
    nock.back.setMode('record');
    const { nockDone } = await nock.back('getAccessToken.json');
    const envConfiguration = configuration;
    const kvConf = kvConfiguration;
    kernel = await new PaymentKernel(envConfiguration, kvConf)
      .initCache()
      .addMessagingPlugin(initRxMessagingPlugin())
      .useDb(true)
      .initDependencies();
    displayCardDetails = kernel.get(DisplayCardDetails);
    displayCardPin = kernel.get(DisplayCardPin);
    cardHmac = kernel.get(CardHmac);
    writeService = kernel.get<WriteService>(PaymentIdentifier.accountManagementWriteService);
    aBankAccount = {
      uid: 'UpmekTXcJ',
      bid: '7188',
      iban: 'FR4112869000020PC000005JO21',
      cards: [
        {
          cid: 'card-BGBpCxjZO',
          uniqueId: '1286900002P9AkFkWGIE23S5VmYvfkww',
          pan: '9396XXXXXXXX6907',
          status: 1,
          cardType: 2,
          hasPin: false,
          blocked: false,
          foreignPayment: true,
          internetPayment: true,
          atmWeeklyAllowance: 300,
          atmWeeklyUsedAllowance: 0,
          monthlyAllowance: 3000,
          monthlyUsedAllowance: 0,
        },
      ],
      beneficiaries: [],
      bic: 'BACCFR23XXX',
      monthlyAllowance: {
        authorizedAllowance: 0,
        remainingFundToSpend: 0,
        spentFunds: 0,
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

  describe('DisplayCardDetails', () => {
    afterAll(() => {
      jest.clearAllMocks();
    });

    it('Should get encrypted card details', async () => {
      const encryptedCardDetails = await displayCardDetails.execute({
        uid: aBankAccount.uid,
        cardId: aBankAccount.cards[0].cid,
        rsaPublicKey,
      });

      expect(encryptedCardDetails).toEqual({
        encryptedData:
          'FLhzFAyqzNQxEnQ7vqPzV7ko26NekTlYo5w2XZkIkYPA0n9qDFOGJ7f2A/SH/b1i+XeFUMG687A+5Pmec5ke6pgQPqcZots5I1trPeGEsqN6eVPVmoKS5YITpywTbGgbkr1i+5NyyphrWlZW6R5WIrXfVg0ABmJyVK+DpbKD/jkPMZBisZ/7ju4wb8TjRwt0KhJIKImcvexCX0KYM+qwQt9DIap5YCOwIk68i/5o435c6Y1hBeJHr8CCjzaAVFwYk8wIG0DDi5+HMzROrvUm1WI9tWcxpCmBlRzvNv5Wh9OmLcZNas1Bx8mGaBYVRQTMAjlESVn0jAiGsdIoIAYZOUJHHhgPWxiem1E6cVBySe297h06UFAIXgLQyg/Az733CWduDnWvQXV6H7DAYgIyWVrbHgiBcw/IiIghcMCzLf0UClvItnlJfzJG7Hwdfs4X+VFrYoG8Q2wAaE4QLhYpR/3hqKfLg7/8TKN/L4OWlkRI83EQ3ShdMVtwsLsNomzHrNNulIh7+kKQ4LKcLylz6owwuJeHOsWDODdvpeYd7BIqquCLpaoyxtPvsjHGKhBgC4Pp8NTYZRYwjIitnsmFmWr6ksqHicJ1/6lj4D5kgt66LIRQWR5sYIzQOSYd8VbM9ukpqpA7pCxmy0M7w3EA9JV0H5fS4qiGSZtB93izIKk=',
        isSuccess: true,
      });
    });

    it('Should not get encrypted card details for a card not owned', async () => {
      const encryptedCardDetailsPromise = displayCardDetails.execute({
        uid: aBankAccount.uid,
        cardId: 'not_owned',
        rsaPublicKey,
      });

      await expect(encryptedCardDetailsPromise).rejects.toThrowError(
        new CardError.CardNotFound('CARD_NOT_FOUND'),
      );
    });
  });

  describe('DisplayCardPin', () => {
    afterAll(() => {
      jest.clearAllMocks();
    });

    it('Should get encrypted card pin', async () => {
      const encryptedCardPin = await displayCardPin.execute({
        uid: aBankAccount.uid,
        cardId: aBankAccount.cards[0].cid,
        rsaPublicKey,
      });

      expect(encryptedCardPin).toEqual({
        pinBlock: 'D5DRGj6F1po=',
        ktaKey: 'g7JDPvyJfB1QdGcXD3Inqw==',
        ktkKey:
          'WJcfDICWyhpQAl7Rzg/9sBImpWCHpA7cOHm/SbRLg4P0XF/dZEzGPX58iCg1A6I36vX6j2cA7mAksWHaA0rTHtAlSCpcm1zNeAoYC7ZiBHUOVXJjThPix2YMHUT15WCn3OrcOcqFHTOoDwRu2t+RHJTUOvzN2RiXe6lDWx0D2GW8euCs6JguucrjbwvzITs9Kf9IFG98f3lUE2eUar5QPBP9CzsVM1+Xe1mIsNSK/+QERXDOyl4tgyU035h5Ot75EglExM6ullYUBlHC9VTG5Ls7UMkRf4VZKQYSsRiNelaQt33+q7YzhHWWtIs1HAo5NLdoO0AI/iEoln7ZMOWi3g==',
      });
    });

    it('Should not get encrypted card pin for a card not owned', async () => {
      const encryptedCardPinPromise = displayCardPin.execute({
        uid: aBankAccount.uid,
        cardId: 'not_owned',
        rsaPublicKey,
      });

      await expect(encryptedCardPinPromise).rejects.toThrowError(
        new CardError.CardNotFound('CARD_NOT_FOUND'),
      );
    });
  });

  describe('CardHmac', () => {
    afterAll(() => {
      jest.clearAllMocks();
    });

    it('Should get encrypted card hmac', async () => {
      const encryptedCardHmac = await cardHmac.execute({
        uid: aBankAccount.uid,
        cardId: aBankAccount.cards[0].cid,
        hmacData:
          'MzMzMDMwMzAzNzMxMzIzODM2MzkzMDMwMzAzMDMyNzkzMjQzMzU1MjQzNDE1NDc1NTU1NzQzNjQzNzMxNkY1QTRGNzA3MzZENDEzMTM2MzEzOTMwMzIzMTM3MzkzNg==',
        rsaPublicKey,
      });

      expect(encryptedCardHmac).toEqual({
        encryptedData:
          'R2wfVN1r2Qgia+0aiZzWThkIWuRhtqSmPqtduVTM5rcdqdCDRkvEB1T8tq0jRnaihi2iA4eFqxlk6G5pCok7FK54nYarE3xQUWiyk6tQcuZq6Y3B5L03FWi+BfNL5ORu5/28LfGt9saqHxo5iyULCnoqR+rlgONIlYnTU6qi3jvtFjIijWwfhELWcVCC12chY+UKtFhETI1xzwgWFYWJck9Z+gAql6yNQnq80QMAArcNpwZMnnmtdfObsWi4ob0lUSxgryglCD9yiWEzgw8OPOAlK4aLM7xyWRHr07YXJd0P9iBL7n3XZhOx2rbLdtXkhy33jqhx0ve6TThdvjzVA5/9ZMv6PyCDIKH6q0bCS0P1MGJa0FIfP5zAIcc8ui2qWr4pR0Bw1meIJAUrZhIrLW4xfxyTq3faISaBSar3uLsYCkbXSxDs7Vymyc65JO30iXIOlNbLyRD9dsVQKAMOgLPRZrQ34sabV1FGvPNIbVzGhogXigz59+SNoSk6k1prHvNv8rBBBduYpN8im7kF8VTkbqht46QO10s8EYrVAbg7Joyxix8tSGEemdkMUfij8UEFh/KKyI/iwg78poHryWjcZA/O+Cgnv8Q9O2rKc4PyLvsJAV7uRfpdmc311upsZ0Q4B2ohnNhU/lMJ3NkyjlRhL7x9ClLzKbfpPXARUug=',
        isSuccess: true,
      });
    });

    it('Should not get encrypted card hmac for a card not owned', async () => {
      const encryptedCardHmacPromise = cardHmac.execute({
        uid: aBankAccount.uid,
        cardId: 'not_owned',
        hmacData:
          'MzMzMDMwMzAzNzMxMzIzODM2MzkzMDMwMzAzMDMyNzkzMjQzMzU1MjQzNDE1NDc1NTU1NzQzNjQzNzMxNkY1QTRGNzA3MzZENDEzMTM2MzEzOTMwMzIzMTM3MzkzNg==',
        rsaPublicKey,
      });

      await expect(encryptedCardHmacPromise).rejects.toThrowError(
        new CardError.CardNotFound('CARD_NOT_FOUND'),
      );
    });
  });
});
