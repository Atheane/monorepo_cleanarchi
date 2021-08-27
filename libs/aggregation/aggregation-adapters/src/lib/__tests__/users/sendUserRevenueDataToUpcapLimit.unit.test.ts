import { expect, it, describe, beforeAll, beforeEach } from '@jest/globals';
import * as nock from 'nock';
import * as dateMock from 'jest-date-mock';
import { EventProducerDispatcher } from '@oney/messages-core';
import * as path from 'path';
import { userWithRevenueData } from './fixtures/userWithRevenueData';
import { AggregationKernel } from '../../di/AggregationKernel';
import { DomainDependencies } from '../../di/DomainDependencies';
import { testConfiguration } from '../config';
import { createUser, payloadSignIn, stateCase, aggregateAccounts } from '../generate.fixtures';

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

describe('Evaluate bank account to upcap limits unit testing', () => {
  let dependencies: DomainDependencies;
  let kernel: AggregationKernel;
  let saveFixture: Function;
  const testIt: any = test;

  beforeAll(async () => {
    kernel = new AggregationKernel(testConfiguration);
    await kernel.initDependencies(true);
    dependencies = kernel.getDependencies();
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures`);
    nock.back.setMode('record');
    dateMock.advanceTo(new Date('2020-05-21T00:00:00.000Z'));
    // when defining new fixtures, please uncomment line below
    // jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });

  beforeEach(async () => {
    nock.restore();
    nock.activate();
    const { nockDone } = await nock.back(testIt.getFixtureName());
    saveFixture = nockDone;
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

  afterAll(() => {
    nock.cleanAll();
  });

  it('Should dispatch USER_REVENUE_DATA_CALCULATED', async () => {
    const userId = 'K-oZktdWv';
    await createUser(kernel, userId);
    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.VALID));
    await aggregateAccounts(kernel, userId, bankConnection);
    await dependencies.uploadUserDataToCreditDecisioningPartner.execute({ userId });
    const userWithCreditDecisioningId = await dependencies.userRepository.findBy({ userId });
    const eventDispatcherSpy = jest.spyOn(kernel.get(EventProducerDispatcher), 'dispatch');
    await dependencies.sendUserRevenueDataToUpcapLimit.execute({
      banksUserId: userWithCreditDecisioningId.props.creditDecisioningUserId,
    });
    expect(eventDispatcherSpy).toHaveBeenCalledWith(userWithRevenueData);
  });
});
