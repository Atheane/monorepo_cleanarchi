import * as express from 'express';
import * as request from 'supertest';
import * as nock from 'nock';
import * as path from 'path';
import { configureApp, initRouter } from '../config/server/express';
import { CustomerServiceCommand } from '../modules/customerService/command/CustomerServiceCommand';

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures/customerService`);
// nockBack.setMode('record');

const app: express.Application = express();

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

describe('Customer service integration api testing', () => {
  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/env/test.env');
    await configureApp(envPath, true);
    await initRouter(app, envPath);
  });

  beforeEach(() => nock.enableNetConnect(/127\.0\.0\.1/));

  it('Should sent user demand to customer service with success', async () => {
    nock.enableNetConnect(/127\.0\.0\.1/);
    const customerServiceCommand: CustomerServiceCommand = {
      firstname: 'Mando',
      lastname: 'Lorian',
      birthname: 'Din Djarin',
      email: 'mando.lorian@gmail.com',
      phone: '0707070708',
      gender: 'M',
      topic: 'Ma carte',
      demand: "J'ai perdu ma carte, comment puis-je en commander une nouvelle",
    };

    await request(app)
      .post('/profile/customer-service')
      .send(customerServiceCommand)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          isSent: true,
        });
      });
  });

  it('Should throw BAD_REQUEST if gender value is number', async () => {
    nock.enableNetConnect(/127\.0\.0\.1/);
    const customerServiceCommand = {
      firstname: 'Mando',
      lastname: 'Lorian',
      birthname: 'Din Djarin',
      email: 'mando.lorian@gmail.com',
      phone: '0707070708',
      gender: 1,
      topic: 'nimp',
      demand: "J'ai perdu ma carte, comment puis-je en commander une nouvelle",
    };

    await request(app).post('/profile/customer-service').send(customerServiceCommand).expect(400);
  });

  it('Should get customer service topics', async () => {
    const { nockDone } = await nockBack('customer-service-topics.json');
    nock.enableNetConnect(/127\.0\.0\.1/);

    await request(app)
      .get('/profile/customer-service/topics')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          ACCOUNT_CREATION: 'Ma demande de création de compte',
          ACCOUNT: 'Mon compte',
          TRANSACTIONS: 'Mes transactions',
          CARD: 'Ma carte',
          PROFILE: 'Mon profil',
          APP: 'Mon application',
          CLAIM: "J'ai une réclamation",
          IDEA: "J'ai une idée pour vous",
          BACK_OFF: 'Je souhaite me rétracter',
          CLOSE_ACCOUNT: 'Je souhaite fermer mon compte Oney+',
        });
      });

    await nockDone();
  });

  it('should throw document not found', async () => {
    const { nockDone } = await nockBack('document-not-found.json');
    nock.enableNetConnect(/127\.0\.0\.1/);

    await request(app)
      .get('/profile/customer-service/topics?versionNumber=fake-version-number')
      .expect(404)
      .expect(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            name: 'DocumentNotFound',
            message: 'DOCUMENT_NOT_FOUND',
          }),
        );
      });
    await nockDone();
  });
});
