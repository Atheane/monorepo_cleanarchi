import { expect, it, describe, beforeAll, beforeEach } from '@jest/globals';
import { BankConnectionError } from '@oney/aggregation-core';
import * as nock from 'nock';
import * as path from 'path';
import { AggregationKernel } from '../../di/AggregationKernel';
import { DomainDependencies } from '../../di/DomainDependencies';
import { testConfiguration } from '../config';
import { createUser, payloadSignIn, stateCase } from '../generate.fixtures';

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
  let saveFixture: Function;
  const userId = 'K-oZktdWv';
  const testIt: any = test;
  beforeAll(async () => {
    kernel = new AggregationKernel(testConfiguration);
    await kernel.initDependencies(true);
    dependencies = kernel.getDependencies();
    await createUser(kernel, userId);
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures`);
    nock.back.setMode('record');
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

  it('Should update a bankConnection password', async () => {
    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.VALID));
    const bankConnectionSyncToPasswordExpired = dependencies.signIn.execute(
      payloadSignIn(userId, stateCase.PASSWORD_EXPIRED),
    );
    await expect(bankConnectionSyncToPasswordExpired).rejects.toThrow(BankConnectionError.WrongPassword);

    const bankConnectionUpdated = await dependencies.updateConnection.execute({
      ...bankConnection.props,
      form: [
        {
          name: 'openapiwebsite',
          value: 'par',
        },
        {
          name: 'login',
          value: 'Identifiant',
        },
        {
          name: 'password',
          value: '1234',
        },
      ],
    });

    expect(bankConnectionUpdated.props).toEqual({
      ...bankConnection.props,
    });
    await dependencies.deleteBankConnection.execute({
      connectionId: bankConnection.props.connectionId,
      userId,
    });
  });

  it('Should throw wrongPassword', async () => {
    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.VALID));
    const bankConnectionSyncToPasswordExpired = dependencies.signIn.execute(
      payloadSignIn(userId, stateCase.PASSWORD_EXPIRED),
    );
    await expect(bankConnectionSyncToPasswordExpired).rejects.toThrow(BankConnectionError.WrongPassword);

    const bankConnectionUpdated = dependencies.updateConnection.execute({
      ...bankConnection.props,
      form: [
        {
          name: 'openapiwebsite',
          value: 'par',
        },
        {
          name: 'login',
          value: 'Identifiant',
        },
        {
          name: 'password',
          value: '4321',
        },
      ],
    });

    await expect(bankConnectionUpdated).rejects.toThrow(BankConnectionError.WrongPassword);
  });
});
