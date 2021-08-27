/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';

import { ConfigService } from '@oney/env';
import { EventDispatcher } from '@oney/messages-core';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED } from 'http-status';
import * as nock from 'nock';
import { BankConnectionError } from '@oney/aggregation-core';
import * as path from 'path';
import { request } from 'https';
import {
  requestEUR,
  requestNoBody,
  requestNoUrlToken,
  requestWithServerError,
  bankConnectionDeletedMessage,
  requestEURMoreThanFiftyTransactions,
} from './fixtures';
import { AzfKernel } from '../../config/di/AzfKernel';
import { IAzfConfiguration, getAppConfiguration } from '../../config/envs';
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

describe('Save Transactions unit testing', () => {
  const nockBack = nock.back;
  nockBack.fixtures = path.resolve(`${__dirname}/fixtures`);

  const envPath = path.resolve(`${__dirname}/env/test.env`);
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
  });

  it('should throw server error cause Kernel not setUp', async () => {
    const context: any = {
      log: console.log,
      req: requestWithServerError,
      done: () => console.log('done'),
    };

    await accountSyncWebhookHandler(context, requestEUR);
    const response = (context as any).res;

    expect(response.status).toEqual(INTERNAL_SERVER_ERROR);
  });

  it('saves all transactions, and returns transaction ids', async () => {
    const { nockDone } = await nockBack('getAccountConnection.json');

    const context: any = {
      log: console.log,
      req: requestEUR,
      done: () => console.log('done'),
    };

    const a = { userId: 'kTDhDRrHv', refId: '1805', bankId: '338178e6-3d01-564f-9a7b-52ca442459bf' };

    const kernel = new AzfKernel(config).initDependencies();
    const dependencies = kernel.getDependencies();

    await dependencies.bankConnectionRepository.save(a);
    await accountSyncWebhookHandler(context, requestEUR, kernel);
    const response = (context as any).res;

    const events = await dependencies.eventRepository.getAll();
    const lastIndex = events.length;
    expect(events[lastIndex - 1].type).toEqual('ACCOUNT_SYNC');
    expect(events[lastIndex - 1].data).toBeTruthy();
    expect(events[lastIndex - 1].data.transactions.length).toEqual(1);
    expect(response.status).toEqual(OK);

    nockDone();
  });

  it('should return mapped user id', async () => {
    const { nockDone } = await nockBack('getAccountConnection.json');

    const a = { userId: 'kTDhDRrHv', refId: '1805', bankId: '338178e6-3d01-564f-9a7b-52ca442459bf' };

    const kernel = new AzfKernel(config).initDependencies();
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

    expect(events[lastIndex - 1].data.userId).toEqual('kTDhDRrHv');
    nockDone();
  });

  it('should return bank details', async () => {
    const { nockDone } = await nockBack('getAccountConnection.json');

    const kernel = new AzfKernel(config).initDependencies();
    const dependencies = kernel.getDependencies();

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
    expect(events[lastIndex - 1].data.bank).toEqual({
      id: '338178e6-3d01-564f-9a7b-52ca442459bf',
      label: 'Connecteur de test',
    });

    nockDone();
  });

  it('should return refId on transactions', async () => {
    const { nockDone } = await nockBack('getAccountConnection.json');

    const kernel = new AzfKernel(config).initDependencies();
    const dependencies = kernel.getDependencies();

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
    expect(events[lastIndex - 1].data.refId).toEqual('1805');

    nockDone();
  });

  it('should be undefined when bank label is not found', async () => {
    const { nockDone } = await nockBack('getAccountConnection.bankNotFound.json');

    const kernel = new AzfKernel(config).initDependencies();
    const dependencies = kernel.getDependencies();

    const a = { userId: 'kTDhDRrHv', refId: '1805', bankId: 'XX' };

    await dependencies.bankConnectionRepository.save(a);

    const context: any = {
      log: console.log,
      req: requestEUR,
      done: () => console.log('done'),
    };

    await accountSyncWebhookHandler(context, requestEUR, kernel);

    const events = await dependencies.eventRepository.getAll();
    const lastIndex = events.length;

    expect(events[lastIndex - 1].data.bank.name).toBeUndefined();

    nockDone();
  });

  it('should throw an error account id is required', async () => {
    const context: any = {
      log: console.log,
      req: requestNoBody,
      done: () => console.log('done'),
    };

    const kernel = new AzfKernel(config).initDependencies();

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

    const kernel = new AzfKernel(config).initDependencies();

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

    const kernel = new AzfKernel(config).initDependencies();

    await accountSyncWebhookHandler(context, requestWithServerError, kernel);
    const response = (context as any).res;

    expect(response.status).toEqual(INTERNAL_SERVER_ERROR);
    expect(response.body).toBeUndefined();
  });

  it('should dispatch BI_ACCOUNT_SYNC', async () => {
    const { nockDone } = await nockBack('getAccountConnection.json');

    const context: any = {
      log: console.log,
      req: request,
      done: () => console.log('done'),
    };

    const kernel = new AzfKernel(config).initDependencies();
    const dependencies = kernel.getDependencies();

    const a = { userId: 'kTDhDRrHv', refId: '1805', bankId: '338178e6-3d01-564f-9a7b-52ca442459bf' };
    await dependencies.bankConnectionRepository.save(a);
    const eventDispatcherSpy = jest.spyOn(kernel.get(EventDispatcher), 'dispatch');

    await accountSyncWebhookHandler(context, requestEUR, kernel);

    expect(eventDispatcherSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        props: {
          account: requestEUR.body,
          bank: {
            id: a.bankId,
            label: 'Connecteur de test',
          },
          refId: a.refId,
          userId: a.userId,
        },
      }),
    );
    nockDone();
  });

  it('should delete transactions on BANK_CONNECTON_DELETED', async () => {
    const { nockDone } = await nockBack('getAccountConnection.json');

    const context: any = {
      log: console.log,
      req: requestWithServerError,
      done: () => console.log('done'),
    };

    const kernel = new AzfKernel(config).initDependencies();

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
    const kernel = new AzfKernel(config).initDependencies();
    const dependencies = kernel.getDependencies();

    const result = dependencies.bankConnectionRepository.findBy({ refId: '1805' });

    expect(result).rejects.toThrow(BankConnectionError.BankConnectionNotFound);
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
