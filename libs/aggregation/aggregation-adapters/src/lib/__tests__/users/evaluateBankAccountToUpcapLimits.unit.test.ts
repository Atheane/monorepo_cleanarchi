import { expect, it, describe, beforeAll, beforeEach } from '@jest/globals';
import * as nock from 'nock';
import * as dateMock from 'jest-date-mock';
import {
  EvaluateBankAccountToUncapLimitsHandler,
  UploadUserDataToCreditDecisioningPartner,
  UserError,
} from '@oney/aggregation-core';
import * as path from 'path';
import { evaluateBankAccountToUncapLimitsMessage } from './fixtures/evaluateBankAccountToUncapLimitsMessage';
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

  it('Should upload data to credit partner', async () => {
    const userId = 'K-oZktdWv';
    await createUser(kernel, userId);

    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.VALID));
    await aggregateAccounts(kernel, userId, bankConnection);

    const uploadUserDataToCreditPartner = kernel.get(UploadUserDataToCreditDecisioningPartner);
    const handler = new EvaluateBankAccountToUncapLimitsHandler(uploadUserDataToCreditPartner);
    const spy = jest.spyOn(handler, 'handle');

    await handler.handle(evaluateBankAccountToUncapLimitsMessage);
    expect(spy).toHaveBeenCalledWith(evaluateBankAccountToUncapLimitsMessage);

    const user = await dependencies.userRepository.findBy({ userId });
    expect(user.props.creditDecisioningUserId).toBeTruthy();

    const categorizedTransactions = await dependencies.getCategorizedTransactions.execute({ userId });
    expect(categorizedTransactions.map(t => t.props)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: 'VIREMENT SALAIRE',
          type: 'TRANSFER',
          category: 'WAGE',
        }),
      ]),
    );

    const creditProfile = await dependencies.getUserCreditProfile.execute({ userId });
    expect(creditProfile).toEqual(
      expect.objectContaining({
        creditScoring: { indicators: { cash: 2, lifestyle: 2, savings: 1 }, rate: 982 },
      }),
    );
  });

  it('Should send user unknown', async () => {
    const result = dependencies.sendUserRevenueDataToUpcapLimit.execute({ banksUserId: 'unknown' });
    await expect(result).rejects.toThrow(UserError.UserUnknown);
  });
});
