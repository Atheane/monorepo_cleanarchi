import { expect, it, describe, beforeAll } from '@jest/globals';
import { BankConnection, BankConnectionError, ConnectionStateEnum } from '@oney/aggregation-core';
import * as nock from 'nock';
import { AggregationKernel } from '../../di/AggregationKernel';
import { DomainDependencies } from '../../di/DomainDependencies';
import { testConfiguration } from '../config';
import { createUser } from '../generate.fixtures';

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

describe('Update connection unit testing', () => {
  let dependencies: DomainDependencies;
  let kernel: AggregationKernel;
  const userId = 'K-oZktdWv';
  const bankConnection = new BankConnection({
    userId: 'userId',
    connectionId: 'connectionId',
    bankId: 'bankId',
    refId: '1212',
    connectionDate: new Date(),
    active: true,
    state: ConnectionStateEnum.PASSWORD_EXPIRED,
  });
  beforeAll(async () => {
    kernel = new AggregationKernel(testConfiguration);
    await kernel.initDependencies(true);
    dependencies = kernel.getDependencies();
    await createUser(kernel, userId);
  });

  afterAll(() => {
    nock.cleanAll();
  });

  it('should throw password Expired', async () => {
    nock('https://oney-dev-sandbox.biapi.pro/2.0')
      .post(`/users/me/connections/${bankConnection.props.refId}`)
      .reply(400, {
        code: 'passwordExpired',
      });

    const result = dependencies.bankConnectionGateway.updateConnection({
      bankConnection,
      form: [
        {
          name: 'openapiwebsite',
          value: 'par',
        },
      ],
    });
    await expect(result).rejects.toThrow(BankConnectionError.WrongPassword);
  });

  it('should throw action Needed', async () => {
    nock('https://oney-dev-sandbox.biapi.pro/2.0')
      .post(`/users/me/connections/${bankConnection.props.refId}`)
      .reply(400, {
        code: 'actionNeeded',
      });

    const result = dependencies.bankConnectionGateway.updateConnection({
      bankConnection,
      form: [
        {
          name: 'openapiwebsite',
          value: 'par',
        },
      ],
    });
    await expect(result).rejects.toThrow(BankConnectionError.ActionNeeded);
  });

  it('should throw apiResponseError', async () => {
    nock('https://oney-dev-sandbox.biapi.pro/2.0')
      .post(`/users/me/connections/${bankConnection.props.refId}`)
      .reply(400, {
        code: 'bug',
      });

    const result = dependencies.bankConnectionGateway.updateConnection({
      bankConnection,
      form: [
        {
          name: 'openapiwebsite',
          value: 'par',
        },
      ],
    });
    await expect(result).rejects.toThrow(BankConnectionError.ApiResponseError);
  });
});
