import { CreditDecisioningError } from '@oney/aggregation-core';
import * as dateMock from 'jest-date-mock';
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

describe('PP2reve unit testing', () => {
  let dependencies: DomainDependencies;
  let kernel: AggregationKernel;
  const userId = 'K-oZktdWv';

  beforeAll(async () => {
    kernel = new AggregationKernel(testConfiguration);
    await kernel.initDependencies(true);
    dependencies = kernel.getDependencies();
    await createUser(kernel, userId);
    dateMock.advanceTo(new Date('2020-05-21T00:00:00.000Z'));
  });

  afterAll(() => {
    nock.cleanAll();
  });

  it('should throw api response error if create new algoan user', async () => {
    nock('https://api.preprod.algoan.com').post('/v1/banks-users').reply(500, {
      code: 'serverError',
    });

    const result = dependencies.creditDecisioningService.createCreditDecisioningUser();
    await expect(result).rejects.toThrow(CreditDecisioningError.ApiResponseError);
  });

  it('should throw api response error if get categorized transactions', async () => {
    const bankUserId = 'azeaze';
    const bankAccountId = 'azea';
    nock('https://api.preprod.algoan.com')
      .get(`/v1/banks-users/${bankUserId}/accounts/${bankAccountId}/transactions`)
      .reply(500, {
        code: 'serverError',
      });

    const result = dependencies.creditDecisioningService.getCategorizedTransactions(bankUserId);
    await expect(result).rejects.toThrow(CreditDecisioningError.ApiResponseError);
  });
});
