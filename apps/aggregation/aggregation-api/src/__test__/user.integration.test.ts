import 'reflect-metadata';
import * as express from 'express';
import { Container } from 'inversify';
import * as dateMock from 'jest-date-mock';
import * as mongoose from 'mongoose';
import * as nock from 'nock';
import * as request from 'supertest';
import {
  AggregateAccounts,
  ConnectionStateEnum,
  GetTransactionsByConnectionId,
  PostAllTransactions,
  SignIn,
} from '@oney/aggregation-core';
import * as path from 'path';
import { configureApp, initRouter } from './bootstrap';
import {
  getUserToken,
  payloadSignIn,
  stateCase,
  createUser,
  getAccounts,
  getAggregatedAccounts,
  testConnector,
  getConnectionScaRequired,
  getConnectionPasswordExpired,
} from './fixtures/generate.fixtures';
import { userTokenFixtures } from './fixtures/userTokenFixtures';
import { testConfiguration } from './config';
import { BankAccountMapper } from '../modules/user/mappers/BankAccountMapper';
import { PP2ReveTransactionMapper } from '../modules/user/mappers/PP2ReveTransactionMapper';
import { BankMapper } from '../modules/bank/mappers';

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

describe('User integration api testing', () => {
  let container: Container;
  let saveFixture: Function;
  const userId = 'K-oZktdWv';
  const testIt: any = test;
  const app: express.Application = express();

  beforeAll(async () => {
    // necessary for CI and mongo-server
    dateMock.advanceTo(new Date('2020-05-21T00:00:00.000Z'));

    container = await configureApp(testConfiguration, false, process.env.MONGO_URL);
    await initRouter(app);
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures`);
    nock.back.setMode('record');
  });

  beforeEach(async () => {
    nock.restore();
    nock.activate();
    const { nockDone } = await nock.back(testIt.getFixtureName());
    saveFixture = nockDone;

    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
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

  it('Should throw user unknown error', async () => {
    const userId = 'ezknproiuzge';
    const token = await getUserToken(container, userId);

    await request(app)
      .get(`/aggregation/users/${userId}/connections`)
      .set('authorization', 'Bearer ' + token)
      .expect(404)
      .expect(({ body: error }) => {
        expect(error).toEqual({
          error: 'UserUnknown',
          code: 'USER_UNKNOWN',
        });
      });
  });

  it('Should throw unauthorized if user tries to read another user data', async () => {
    const userId = 'azeazeaze';
    await createUser(container, userId);
    await container.get(SignIn).execute(payloadSignIn(userId, stateCase.VALID));

    await request(app)
      .get(`/aggregation/users/${userId}/connections`)
      .set('authorization', 'Bearer ' + userTokenFixtures.test401api.aggregationReadOnly)
      .expect(401);
  });

  it('Should throw unauthorized if user has no rights to read on get connectionId', async () => {
    const userId = 'test401api';
    await createUser(container, userId);
    await container.get(SignIn).execute(payloadSignIn(userId, stateCase.VALID));

    await request(app)
      .get(`/aggregation/users/${userId}/connections`)
      .set('authorization', 'Bearer ' + userTokenFixtures.test401api.aggregationWriteOnly)
      .expect(401)
      .expect(({ body: error }) => {
        expect(error).toEqual({
          error: 'UserCannotRead',
          code: 'USER_CANNOT_READ',
          cause: 'user test401api not allowed to read on aggregation',
        });
      });
  });

  it('Should throw unauthorized if user has no rights to write on triggerSca', async () => {
    const userId = 'test401api';
    await createUser(container, userId);
    const connection = await container.get(SignIn).execute(payloadSignIn(userId, stateCase.VALID));

    await request(app)
      .post(`/aggregation/users/${userId}/connections/${connection.props.connectionId}`)
      .set('authorization', 'Bearer ' + userTokenFixtures.test401api.aggregationReadOnly)
      .expect(401)
      .expect(({ body: error }) => {
        expect(error).toEqual({
          error: 'UserCannotWrite',
          code: 'USER_CANNOT_WRITE',
          cause: 'user test401api not allowed to write on aggregation',
        });
      });
  });

  it('Should get a User connection', async () => {
    const userId = 'azehapzgue';
    const userToken = await getUserToken(container, userId);
    await createUser(container, userId);
    const connection = await container.get(SignIn).execute(payloadSignIn(userId, stateCase.VALID));

    await request(app)
      .get(`/aggregation/users/${userId}/connections/${connection.props.connectionId}`)
      .set('authorization', 'Bearer ' + userToken)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            userId,
            active: true,
            state: 'valid',
            bankId: '338178e6-3d01-564f-9a7b-52ca442459bf',
          }),
        );
      });
  });

  it('Should list accounts accessible from a user bank connection', async () => {
    const userId = 'azebifit';
    const userToken = await getUserToken(container, userId);
    await createUser(container, userId);
    const connection = await container.get(SignIn).execute(payloadSignIn(userId, stateCase.VALID));

    await request(app)
      .get(`/aggregation/users/${userId}/connections/${connection.props.connectionId}/accounts`)
      .set('authorization', 'Bearer ' + userToken)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          accounts: expect.arrayContaining([
            expect.objectContaining({
              name: 'Compte chèque',
              number: '3002900000',
              currency: 'EUR',
              establishment: { name: null },
              aggregated: false,
            }),
          ]),
        });
      });
  });

  it('Should aggregate bank accounts', async () => {
    const userId = 'azeazebhv';
    const userToken = await getUserToken(container, userId);
    await createUser(container, userId);
    const { bankConnection, bankAccounts } = await getAccounts(container, userId);

    const payloadAccounts = {
      accounts: [bankAccounts[0].props],
    };

    const bankAccountMapper = new BankAccountMapper(new BankMapper());
    const expectedResult = bankAccountMapper.fromDomain(bankAccounts[0]);
    expectedResult.aggregated = true;

    await request(app)
      .post(`/aggregation/users/${userId}/connections/${bankConnection.props.connectionId}/accounts`)
      .set('authorization', 'Bearer ' + userToken)
      .send(payloadAccounts)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual([expectedResult]);
      });
  });

  it('Should list aggregated bank accounts', async () => {
    const userId = 'baziejgiuazeg';
    const userToken = await getUserToken(container, userId);
    await createUser(container, userId);
    const { aggregatedAccounts } = await getAggregatedAccounts(container, userId);
    const bankAccountMapper = new BankAccountMapper(new BankMapper());

    const cleanAccounts = aggregatedAccounts.map(anAccount => bankAccountMapper.fromDomain(anAccount));
    const cleanAccount = cleanAccounts[0];
    delete cleanAccount.balance;
    delete cleanAccount.usage;
    delete cleanAccount.type;

    await request(app)
      .get(`/aggregation/users/${userId}/accounts`)
      .set('authorization', 'Bearer ' + userToken)
      .expect(200)
      .expect(({ body: result }) => {
        expect(result).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              bank: testConnector,
              ...cleanAccount,
            }),
          ]),
        );
      });
  });

  it('Should sort and shorten aggregated accounts name', async () => {
    const userId = 'afdvhjkdfjg';
    const userToken = await getUserToken(container, userId);
    await createUser(container, userId);

    const { bankConnection, bankAccounts } = await getAccounts(container, userId);

    await container.get(AggregateAccounts).execute({
      connectionId: bankConnection.props.connectionId,
      accounts: [
        {
          id: bankAccounts[0].props.id,
          name: 'mon compte courant',
          aggregated: true,
        },
        {
          id: bankAccounts[1].props.id,
          name: 'BOURSORAMA',
          aggregated: true,
        },
      ],
      userId,
    });

    const expectedResult = [
      {
        id: bankAccounts[1].props.id,
        name: 'BOURSORAMA',
        aggregated: true,
      },
      {
        id: bankAccounts[0].props.id,
        name: 'mon compte c...',
        aggregated: true,
      },
    ];

    await request(app)
      .get(`/aggregation/users/${userId}/accounts`)
      .set('authorization', 'Bearer ' + userToken)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: expectedResult[0].name,
              aggregated: true,
            }),
            expect.objectContaining({
              name: expectedResult[1].name,
              aggregated: true,
            }),
          ]),
        );
      });
  });

  it('Should get User connections', async () => {
    const userId = 'jbnivyt';
    const token = await getUserToken(container, userId);
    await createUser(container, userId);
    const { connection } = await getAggregatedAccounts(container, userId);

    await request(app)
      .get(`/aggregation/users/${userId}/connections`)
      .set('authorization', 'Bearer ' + token)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          connections: [
            expect.objectContaining({
              connectionId: connection.props.connectionId,
              bankId: connection.props.bankId,
              refId: connection.props.refId,
              userId: connection.props.userId,
              state: ConnectionStateEnum.VALID,
            }),
          ],
        });
      });
  });

  it('Should throw bad request error', async () => {
    const userId = 'azeazebhv';
    const userToken = await getUserToken(container, userId);
    await createUser(container, userId);
    const { bankConnection, bankAccounts } = await getAccounts(container, userId);

    const payloadAccounts = {
      accounts: [
        {
          ...bankAccounts[0],
          aggregated: 'true',
        },
      ],
    };

    await request(app)
      .post(`/aggregation/users/${userId}/connections/${bankConnection.props.connectionId}/accounts`)
      .set('authorization', 'Bearer ' + userToken)
      .send(payloadAccounts)
      .expect(400);
  });

  it('Should trigger sca', async () => {
    const userId = 'azehazomrui';
    const userToken = await getUserToken(container, userId);
    await createUser(container, userId);
    const { synchronizedConnection, updatedConnections } = await getConnectionScaRequired(container, userId);
    const {
      props: { connectionId, bankId, refId },
    } = updatedConnections[0];

    expect(synchronizedConnection.props.state).toBe(ConnectionStateEnum.SCA);

    await request(app)
      .post(`/aggregation/users/${userId}/connections/${connectionId}`)
      .set('authorization', 'Bearer ' + userToken)
      .expect(200)
      .expect(({ body: connection }) => {
        expect(connection).toEqual(
          expect.objectContaining({
            connectionId,
            bankId,
            refId,
            userId,
            state: ConnectionStateEnum.MORE_INFORMATION,
          }),
        );
      });
  });

  it('Should update a bankconnection password', async () => {
    const userId = 'azeqsdaz';
    const userToken = await getUserToken(container, userId);
    await createUser(container, userId);
    const updatedConnection = await getConnectionPasswordExpired(container, userId);
    const { connectionId, bankId } = updatedConnection.props;

    expect(updatedConnection.props.state).toBe(ConnectionStateEnum.PASSWORD_EXPIRED);

    await request(app)
      .post(`/aggregation/users/${userId}/connections/${connectionId}`)
      .set('authorization', 'Bearer ' + userToken)
      .send(payloadSignIn(userId, stateCase.VALID))
      .expect(200)
      .expect(({ body: connection }) => {
        expect(connection).toEqual(
          expect.objectContaining({
            connectionId,
            bankId,
            userId,
            state: ConnectionStateEnum.VALID,
          }),
        );
      });
  });

  it('Should throw bank connection not found', async () => {
    const userId = 'azeazeqs';
    const userToken = await getUserToken(container, userId);
    await createUser(container, userId);
    await container.get(SignIn).execute(payloadSignIn(userId, stateCase.VALID));
    const connectionId = 'FAKE_ID';

    await request(app)
      .get(`/aggregation/users/${userId}/connections/${connectionId}`)
      .set('authorization', 'Bearer ' + userToken)
      .expect(404)
      .expect(({ body: error }) => {
        expect(error).toEqual({
          error: 'BankConnectionNotFound',
          code: 'BANK_CONNECTION_NOT_FOUND',
        });
      });
  });

  it('Should throw bank account not found', async () => {
    const userId = 'zaeazesqdsaz';
    const userToken = await getUserToken(container, userId);
    await createUser(container, userId);
    const connection = await container.get(SignIn).execute(payloadSignIn(userId, stateCase.VALID));

    await request(app)
      .post(`/aggregation/users/${userId}/connections/${connection.props.connectionId}/accounts`)
      .set('authorization', 'Bearer ' + userToken)
      .send({
        accounts: [
          {
            id: 'FAKE_ID',
            name: 'mon compte',
            aggregated: true,
          },
        ],
      })
      .expect(404)
      .expect(({ body: error }) => {
        expect(error).toEqual({
          error: 'BankAccountNotFound',
          code: 'BANK_ACCOUNT_NOT_FOUND',
        });
      });
  });

  it('Should throw field validation failure', async () => {
    const userId = 'hvkyfyutfaz';
    const userToken = await getUserToken(container, userId);
    await createUser(container, userId);
    const connection = await container.get(SignIn).execute(payloadSignIn(userId, stateCase.VALID));

    await request(app)
      .post(`/aggregation/users/${userId}/connections/${connection.props.connectionId}/accounts`)
      .set('authorization', 'Bearer ' + userToken)
      .send({
        accounts: [],
      })
      .expect(400)
      .expect(({ body: error }) => {
        expect(error).toEqual({
          error: 'FieldValidationFailure',
          code: 'FIELD_VALIDATION_FAILURE',
          cause: 'At least one bank account must be provided',
        });
      });
  });

  it('Should throw no aggregated accounts', async () => {
    const userId = 'zaeazbjkehg';
    const userToken = await getUserToken(container, userId);
    await createUser(container, userId);
    const connection = await container.get(SignIn).execute(payloadSignIn(userId, stateCase.VALID));
    await request(app)
      .get(`/aggregation/users/${userId}/connections/${connection.props.connectionId}/transactions`)
      .set('authorization', 'Bearer ' + userToken)
      .expect(404)
      .expect(({ body: error }) => {
        expect(error).toEqual({
          error: 'NoAggregatedAccounts',
          code: 'NO_AGGREGATED_ACCOUNTS',
        });
      });
  });

  it('Should return transactions for a connection', async () => {
    const userId = 'zaeazbjkehg';
    const userToken = await getUserToken(container, userId);
    await createUser(container, userId);
    const { connection } = await getAggregatedAccounts(container, userId);

    await request(app)
      .get(`/aggregation/users/${userId}/connections/${connection.props.connectionId}/transactions`)
      .set('authorization', 'Bearer ' + userToken)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              fullName: 'Monsieur Honoré Émile',
              transactions: expect.arrayContaining([
                expect.objectContaining({
                  type: 'CARD',
                  label: "CB DEBIT IMMEDIAT HALL'S BEER",
                }),
              ]),
            }),
          ]),
        );
      });
  });

  it('Should map accounts if not iban or fullnames', async () => {
    const userId = 'zaeazbjkehg';
    await createUser(container, userId);
    const { connection } = await getAggregatedAccounts(container, userId);
    const { bankAccounts, bankConnection } = await container.get(GetTransactionsByConnectionId).execute({
      userId,
      connectionId: connection.props.connectionId,
    });

    const transactionMapper = new PP2ReveTransactionMapper();
    const bankAccount = bankAccounts[0];

    delete bankAccount.props.ownerIdentity;
    delete bankAccount.props.metadatas.iban;

    const cleanAccounts = transactionMapper.fromDomain({ bankAccount, bankConnection });
    expect(cleanAccounts.fullName).toBeUndefined();
    expect(cleanAccounts.iban).toBeUndefined();
  });

  it('Should get all transactions', async () => {
    const userId = 'zaeazbjkehg';
    const userToken = await getUserToken(container, userId);
    await createUser(container, userId);
    await getAggregatedAccounts(container, userId);

    await request(app)
      .get(`/aggregation/users/${userId}/transactions`)
      .set('authorization', 'Bearer ' + userToken)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              iban: 'EX6713335395899300290000026',
              fullName: 'Monsieur Honoré Émile',
              transactions: expect.arrayContaining([
                expect.objectContaining({
                  currency: 'EUR',
                  type: 'CARD',
                  label: "CB DEBIT IMMEDIAT HALL'S BEER",
                }),
              ]),
            }),
          ]),
        );
      });
  });

  it('Should post transactions', async () => {
    const userId = 'azebahkjgyukyg';
    const userToken = await getUserToken(container, userId);
    await createUser(container, userId);
    await getAggregatedAccounts(container, userId);

    await request(app)
      .post(`/aggregation/users/${userId}/transactions`)
      .set('authorization', 'Bearer ' + userToken)
      .send('')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            unsavedTransactions: expect.arrayContaining([
              expect.objectContaining({
                amount: null,
                currency: 'EUR',
                type: 'CARD',
                label: 'CB DEBIT IMMEDIAT SNCF',
              }),
            ]),
          }),
        );
      });
  });

  it('Should get categorized transactions', async () => {
    const userId = 'zahjviftjkehg';
    const userToken = await getUserToken(container, userId);
    await createUser(container, userId);
    await getAggregatedAccounts(container, userId);
    await container.get(PostAllTransactions).execute({ userId });

    await request(app)
      .get(`/aggregation/users/${userId}/categorized-transaction-aggregate`)
      .set('authorization', 'Bearer ' + userToken)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ category: 'WAGE', label: 'VIREMENT SALAIRE', type: 'TRANSFER' }),
          ]),
        );
      });
  });

  it('should get credit profile', async () => {
    const userToken = await getUserToken(container, userId);
    await createUser(container, userId);
    await getAggregatedAccounts(container, userId);
    await container.get(PostAllTransactions).execute({ userId });

    await request(app)
      .get(`/aggregation/users/${userId}/credit-profile`)
      .set('authorization', 'Bearer ' + userToken)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            creditScoring: { rate: 997, indicators: { savings: 1, lifestyle: 2, cash: 2 } },
          }),
        );
      });
  });

  it('Should throw TransactionsAlreadyPosted', async () => {
    const userId = 'azebkfyazehc';
    const userToken = await getUserToken(container, userId);
    await createUser(container, userId);
    await getAggregatedAccounts(container, userId);
    await container.get(PostAllTransactions).execute({ userId });

    await request(app)
      .post(`/aggregation/users/${userId}/transactions`)
      .set('authorization', 'Bearer ' + userToken)
      .send('')
      .expect(400)
      .expect(({ body: error }) => {
        expect(error).toEqual({
          error: 'TransactionsAlreadyPosted',
          code: 'TRANSACTIONS_ALREADY_POSTED',
        });
      });
  });

  it('Should throw User Unknown', async () => {
    const userId = 'zaesdaze';
    const userToken = await getUserToken(container, userId);
    await createUser(container, userId);
    await container.get(SignIn).execute(payloadSignIn(userId, stateCase.VALID));

    await request(app)
      .get(`/aggregation/users/${userId}/credit-profile`)
      .set('authorization', 'Bearer ' + userToken)
      .expect(404)
      .expect(({ body: error }) => {
        expect(error).toEqual({
          error: 'UserUnknown',
          code: 'CREDIT_DECISIONING_USER_UNKNOWN',
        });
      });
  });

  it('Should return deleted connection', async () => {
    const userId = 'azeouguy';
    const userToken = await getUserToken(container, userId);
    await createUser(container, userId);
    const connection = await container.get(SignIn).execute(payloadSignIn(userId, stateCase.VALID));
    await request(app)
      .delete(`/aggregation/users/${userId}/connections/${connection.props.connectionId}`)
      .set('authorization', 'Bearer ' + userToken)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          connectionId: connection.props.connectionId,
        });
      });
  });

  it('Should return bank connection not found if delete twice', async () => {
    const userId = 'azeouguy';
    const userToken = await getUserToken(container, userId);
    await createUser(container, userId);
    const connection = await container.get(SignIn).execute(payloadSignIn(userId, stateCase.VALID));

    await request(app)
      .delete(`/aggregation/users/${userId}/connections/${connection.props.connectionId}`)
      .set('authorization', 'Bearer ' + userToken)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          connectionId: connection.props.connectionId,
        });
      });

    await request(app)
      .delete(`/aggregation/users/${userId}/connections/${connection.props.connectionId}`)
      .set('authorization', 'Bearer ' + userToken)
      .expect(404)
      .expect(({ body: error }) => {
        expect(error).toEqual({
          error: 'BankConnectionNotFound',
          code: 'BANK_CONNECTION_NOT_FOUND',
        });
      });
  });

  it('Should successfully save user consent', async () => {
    dateMock.advanceTo(new Date('2020-05-21T00:00:00.000Z'));

    const userId = 'zaenkhjgaze';
    const userToken = await getUserToken(container, userId);

    await request(app)
      .post(`/aggregation/users/${userId}/consent`)
      .set('authorization', 'Bearer ' + userToken)
      .send({
        consent: true,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          userId,
          consent: true,
          consentDate: '2020-05-21T00:00:00.000Z',
        });
      });
  });

  it('Should get user consent and date', async () => {
    dateMock.advanceTo(new Date('2020-05-21T00:00:00.000Z'));

    const userId = 'zaenkhjgaze';
    const userToken = await getUserToken(container, userId);
    await createUser(container, userId);

    await request(app)
      .get(`/aggregation/users/${userId}/consent`)
      .set('authorization', 'Bearer ' + userToken)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          userId,
          consent: true,
          consentDate: '2020-05-21T00:00:00.000Z',
        });
      });
  });

  it('Should throw no sca required', async () => {
    const userId = 'zaenkhjgaze';
    const userToken = await getUserToken(container, userId);
    await createUser(container, userId);

    const connection = await container.get(SignIn).execute(payloadSignIn(userId, stateCase.VALID));

    await request(app)
      .post(`/aggregation/users/${userId}/connections/${connection.props.connectionId}`)
      .set('authorization', 'Bearer ' + userToken)
      .send()
      .expect(400)
      .expect(({ body: error }) => {
        expect(error).toEqual({
          code: 'NO_SCA_REQUIRED',
          error: 'NoScaRequired',
        });
      });
  });

  it('Should throw CreditDecisioningError ApiResponseError', async () => {
    // Manually changed the fixture json to change 200 by 500 from GET
    // "/v1/banks-users/607816ed0001ad505f00d4be/accounts/607816ee0001ad08b300d4bf/transactions",
    const userId = 'azjepiauze';
    const userToken = await getUserToken(container, userId);
    await createUser(container, userId);
    await getAggregatedAccounts(container, userId);
    await container.get(PostAllTransactions).execute({ userId });

    await request(app)
      .get(`/aggregation/users/${userId}/categorized-transaction-aggregate`)
      .set('authorization', 'Bearer ' + userToken)
      .expect(424);
  });
});
