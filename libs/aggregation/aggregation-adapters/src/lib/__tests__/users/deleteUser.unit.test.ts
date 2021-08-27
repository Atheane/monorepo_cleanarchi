import { EventDispatcher } from '@oney/messages-core';
import * as nock from 'nock';
import { expect, it, describe, beforeAll, beforeEach } from '@jest/globals';
import { BankConnectionError, UserDeletedHandler, UserError, DeleteUser } from '@oney/aggregation-core';
import * as path from 'path';
import { userDeletedMessage } from './fixtures/userDeletedMesage';
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

describe('Delete user unit testing', () => {
  let dependencies: DomainDependencies;
  let kernel: AggregationKernel;
  let saveFixture: Function;
  const testIt: any = test;
  const userId = 'azbeoayuyt';

  beforeAll(async () => {
    kernel = new AggregationKernel(testConfiguration);
    await kernel.initDependencies(true);
    dependencies = kernel.getDependencies();
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures`);
    nock.back.setMode('record');
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

  it('Should delete a user and its related bankConnections', async () => {
    const eventDispatcherSpy = jest.spyOn(kernel.get(EventDispatcher), 'dispatch');

    await createUser(kernel, userId);
    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.VALID));
    const bankConnections = await dependencies.bankConnectionRepository.filterBy({ userId });

    await dependencies.deleteUser.execute({ userId });

    expect(eventDispatcherSpy).toHaveBeenCalledTimes(bankConnections.length);

    const userInDB = dependencies.userRepository.findBy({ userId });
    expect(userInDB).rejects.toThrow(UserError.UserUnknown);
    const connectionInDB = dependencies.bankConnectionRepository.findBy({
      connectionId: bankConnection.props.connectionId,
    });
    expect(connectionInDB).rejects.toThrow(BankConnectionError.BankConnectionNotFound);
  });

  it('should handle USER_DELETED event', async () => {
    await createUser(kernel, userId);
    await dependencies.signIn.execute(payloadSignIn(userId, stateCase.VALID));

    const deleteUser = kernel.get(DeleteUser);

    const userDeletedHandler = new UserDeletedHandler(deleteUser);

    const spy = jest.spyOn(userDeletedHandler, 'handle');

    await userDeletedHandler.handle(userDeletedMessage);
    expect(spy).toHaveBeenCalledWith(userDeletedMessage);
  });
});
