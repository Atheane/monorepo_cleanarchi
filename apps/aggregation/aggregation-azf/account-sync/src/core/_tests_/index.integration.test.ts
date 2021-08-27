/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import { ConfigService } from '@oney/env';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED } from 'http-status';
import * as mongoose from 'mongoose';
import * as nock from 'nock';
import { MongoClient } from 'mongodb';
import { BankConnectionError } from '@oney/aggregation-core';
import * as path from 'path';
import {
  requestEUR,
  requestNoBody,
  requestNoUrlToken,
  requestWithServerError,
  bankConnectionDeletedMessage,
  requestEURMoreThanFiftyTransactions,
} from './fixtures';
import { AzfKernel } from '../../config/di/AzfKernel';
import { DomainDependencies } from '../../config/di/DomainDependencies';
import { IAzfConfiguration, getAppConfiguration } from '../../config/envs';
import { initMongooseConnection } from '../../config/setUp';
import { BankConnectionDeletedHandler } from '../domain/events/handlers/BankConnectionDeletedHandler';
import { DeleteTransactionsByConnectionId } from '../usecases/DeleteTransactionsByConnectionId';
import accountSyncWebhookHandler from '../../../index';

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

describe('Save Transactions integration testing', () => {
  const nockBack = nock.back;
  nockBack.fixtures = path.resolve(`${__dirname}/fixtures`);
  nockBack.setMode('record');

  const envPath = path.resolve(`${__dirname}/env/test.env`);

  let kernel: AzfKernel;
  let dependencies: DomainDependencies;
  let dbConnection: mongoose.Connection;
  let config: IAzfConfiguration;

  beforeAll(async () => {
    await new ConfigService({
      localUri: envPath,
      keyvaultUri: process.env.AUTH_KEY_VAULT_URI,
    }).loadEnv();
    config = getAppConfiguration();
  });

  beforeEach(async () => {
    nock.cleanAll();
    config.cosmosDbConnectionString = process.env.MONGO_URL;
    dbConnection = await initMongooseConnection(config);
    kernel = new AzfKernel(config).initDependencies(dbConnection);
    dependencies = kernel.getDependencies();
  });

  afterEach(async done => {
    const mongoClient = await MongoClient.connect(process.env.MONGO_URL);
    /**
     * Special case needed before dbName is explicitly mentionned in configuration
     * */
    await mongoClient.db('odb_aggregation').dropDatabase();
    await mongoClient.db('odb_eventstore').dropDatabase();
    await done();
  });

  it('saves all transactions, and returns transaction ids', async () => {
    const { nockDone } = await nockBack('getAccountConnection.json');

    const a = { userId: 'kTDhDRrHv', refId: '1805', bankId: '338178e6-3d01-564f-9a7b-52ca442459bf' };
    await dependencies.bankConnectionRepository.save(a);

    const context: any = {
      log: console.log,
      req: requestEUR,
      done: () => console.log('done'),
    };

    await accountSyncWebhookHandler(context, requestEUR, kernel);
    const response = (context as any).res;

    const events = await dependencies.eventRepository.getAll();

    const lastIndex = events.length;
    expect(lastIndex).toEqual(28);

    expect(events[lastIndex - 1].type).toEqual('ACCOUNT_SYNC');
    expect(events[lastIndex - 1].data).toBeTruthy();
    expect(events[lastIndex - 1].data.transactions.length).toEqual(1);
    expect(response.status).toEqual(OK);

    nockDone();
  });

  it('should return mapped user id', async () => {
    const { nockDone } = await nockBack('getAccountConnection.json');

    const a = { userId: 'kTDhDRrHv', refId: '1805', bankId: '338178e6-3d01-564f-9a7b-52ca442459bf' };
    await dependencies.bankConnectionRepository.save(a);

    const context: any = {
      log: console.log,
      req: requestEUR,
      done: () => console.log('done'),
    };

    await accountSyncWebhookHandler(context, requestEUR, kernel);

    const events = await dependencies.eventRepository.getAll();
    const lastIndex = events.length;

    expect(events[lastIndex - 1].data.userId).toEqual('kTDhDRrHv');
    nockDone();
  });

  it('should throw an error account id is required', async () => {
    const context: any = {
      log: console.log,
      req: requestNoBody,
      done: () => console.log('done'),
    };

    await accountSyncWebhookHandler(context, requestNoBody, kernel);
    const response = (context as any).res;

    expect(response.status).toEqual(BAD_REQUEST);
    expect(response.error).toBeTruthy();
  });

  it('should throw forbidden if no or unknown credential is provided', async () => {
    const context: any = {
      log: console.log,
      req: requestNoUrlToken,
      done: () => console.log('done'),
    };

    await accountSyncWebhookHandler(context, requestNoUrlToken, kernel);
    const response = (context as any).res;

    expect(response.status).toEqual(UNAUTHORIZED);
  });

  it('should not save any transaction if no transaction is sent', async () => {
    const context: any = {
      log: console.log,
      req: requestWithServerError,
      done: () => console.log('done'),
    };

    await accountSyncWebhookHandler(context, requestWithServerError, kernel);
    const response = (context as any).res;

    expect(response.status).toEqual(INTERNAL_SERVER_ERROR);
    expect(response.body).toBeUndefined();
  });

  it('should delete transactions on BANK_CONNECTON_DELETED', async () => {
    const { nockDone } = await nockBack('getAccountConnection.json');

    const context: any = {
      log: console.log,
      req: requestWithServerError,
      done: () => console.log('done'),
    };

    const dependencies = kernel.getDependencies();
    const deleteTransactionsByConnectionId = kernel.get(DeleteTransactionsByConnectionId);

    const a = { userId: 'kTDhDRrHv', refId: '1805', bankId: '338178e6-3d01-564f-9a7b-52ca442459bf' };
    await dependencies.bankConnectionRepository.save(a);

    // populate InMemoryRepo
    await accountSyncWebhookHandler(context, requestEUR, kernel);

    const bankConnectionDeletedHandler = new BankConnectionDeletedHandler(deleteTransactionsByConnectionId);

    const spy = jest.spyOn(bankConnectionDeletedHandler, 'handle');

    const transactions = (await dependencies.eventRepository.getAll()).filter(
      aTransaction =>
        aTransaction.data.id.toString() === bankConnectionDeletedMessage.props.deletedAccountIds[0],
    );

    expect(transactions.length).toBe(28);
    await bankConnectionDeletedHandler.handle(bankConnectionDeletedMessage);
    expect(spy).toHaveBeenCalledWith(bankConnectionDeletedMessage);

    const transactionsAfterDelete = (await dependencies.eventRepository.getAll()).filter(
      aTransaction =>
        aTransaction.data.id.toString() === bankConnectionDeletedMessage.props.deletedAccountIds[0],
    );

    expect(transactionsAfterDelete.length).toBe(0);
    spy.mockReset();
    nockDone();
  });

  it('should throw bank connection not found', async () => {
    const result = dependencies.bankConnectionRepository.findBy({ refId: 'XXX' });

    expect(result).rejects.toThrow(BankConnectionError.BankConnectionNotFound);
  });

  it('should not find a connection', async () => {
    const { nockDone } = await nockBack('getAccountConnection.bankConnectionNotFound.json');

    const a = { userId: 'kTDhDRrHv', refId: 'XXX', bankId: '338178e6-3d01-564f-9a7b-52ca442459bf' };

    const kernel = await new AzfKernel(config).initDependencies();
    const dependencies = kernel.getDependencies();

    await dependencies.bankConnectionRepository.save(a);

    const context: any = {
      log: console.log,
      req: requestEUR,
      done: () => console.log('done'),
    };

    await accountSyncWebhookHandler(context, requestEUR, kernel);

    const events = await dependencies.eventRepository.getAll();
    const lastIndex = events.length;

    expect(events[lastIndex - 1].data.userId).toBeUndefined();
    nockDone();
  });

  it('saves all transactions, and returns transaction ids for big batch', async () => {
    const a = { userId: 'kTDhDRrHv', refId: '1805', bankId: '338178e6-3d01-564f-9a7b-52ca442459bf' };

    const kernel = new AzfKernel(config).initDependencies();
    const dependencies = kernel.getDependencies();

    await dependencies.bankConnectionRepository.save(a);
    const { body } = requestEURMoreThanFiftyTransactions;
    await dependencies.saveEvents.execute({
      body,
      userId: a.userId,
      refId: a.refId,
      bank: {
        id: a.bankId,
        label: 'Connecteur de test',
      },
    });
    const events = await dependencies.eventRepository.getAll();
    expect(events.length).toEqual(requestEURMoreThanFiftyTransactions.body.transactions.length);
  });
});
