import * as express from 'express';
import * as nock from 'nock';
import * as request from 'supertest';
import * as path from 'path';
import { configureApp, initRouter } from './bootstrap';
import { testConfiguration } from './config';

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

describe('Banks integration api testing', () => {
  let saveFixture: Function;
  const testIt: any = test;
  const app: express.Application = express();

  beforeAll(async () => {
    await configureApp(testConfiguration, false, process.env.MONGO_URL);
    await initRouter(app);
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures`);
    nock.back.setMode('record');
  });

  beforeEach(async () => {
    nock.restore();
    nock.activate();
    const { nockDone } = await nock.back(testIt.getFixtureName());
    saveFixture = nockDone;

    nock.enableNetConnect(/127\.0\.0\.1/);
  });

  afterEach(async () => {
    const nockObjects = nock.recorder.play();
    if (nockObjects.length == 0) {
      nock.restore();
    } else {
      console.log('saving nock fixture for: ', testIt.getFixtureName());
      saveFixture();
    }
  });

  it('Should get all banks', async () => {
    await request(app)
      .get('/aggregation/banks')
      .expect(200)
      .expect(({ body: banks }) => {
        expect(banks).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ code: '16188' }),
            expect.objectContaining({ code: '30004' }),
            expect.objectContaining({ name: 'Hello bank!' }),
          ]),
        );
        expect(banks).not.toEqual(
          expect.arrayContaining([expect.objectContaining({ name: 'Air France (relevés Flying Blue)' })]),
        );
      });
  });

  it('Should get bank by id', async () => {
    const BNP_UID = 'f711dd7a-6289-5bda-b3a4-f2febda8c046';
    await request(app)
      .get(`/aggregation/banks/${BNP_UID}`)
      .expect(200)
      .expect(({ body: bank }) => {
        expect(bank).toEqual(expect.objectContaining({ code: '30004' }));
      });
  });

  it('Should get error BankNotFound', async () => {
    const FAKE_UID = 'FAKE_UID';
    await request(app)
      .get(`/aggregation/banks/${FAKE_UID}`)
      .expect(404)
      .expect(({ body: error }) => {
        expect(error).toEqual({
          error: 'BankNotFound',
          code: 'BANK_NOT_FOUND',
        });
      });
  });
});
