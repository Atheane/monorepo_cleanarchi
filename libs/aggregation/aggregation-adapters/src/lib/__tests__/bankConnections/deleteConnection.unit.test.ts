import * as nock from 'nock';
import { expect, it, describe, beforeAll, beforeEach } from '@jest/globals';
import { EventProducerDispatcher } from '@oney/messages-core';
import { BankConnectionError, User } from '@oney/aggregation-core';
import * as path from 'path';
import { AggregationKernel } from '../../di/AggregationKernel';
import { DomainDependencies } from '../../di/DomainDependencies';
import { testConfiguration } from '../config';

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

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures`);

describe('Delete connection unit testing', () => {
  let dependencies: DomainDependencies;
  const testConnector = { uuid: '338178e6-3d01-564f-9a7b-52ca442459bf' };
  let kernel: AggregationKernel;
  let user: User;
  beforeAll(async () => {
    const appConfig = testConfiguration;
    kernel = new AggregationKernel(appConfig);
    await kernel.initDependencies(true);
    dependencies = kernel.getDependencies();
    user = User.create({
      userId: 'azeazhgauipzeaz',
      consent: true,
    });
    await dependencies.userRepository.create(user.props);
  });

  beforeEach(() => {
    nock.cleanAll();
  });

  it('Should delete a bankConnection', async () => {
    const { nockDone } = await nockBack('deleteConnection.json');

    const bankConnection = await dependencies.signIn.execute({
      bankId: testConnector.uuid,
      userId: user.props.userId,
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

    const { connectionId, userId } = bankConnection.props;

    await dependencies.deleteBankConnection.execute({ userId, connectionId });

    const connectionInDB = dependencies.bankConnectionRepository.findBy({ connectionId });
    expect(connectionInDB).rejects.toThrow(BankConnectionError.BankConnectionNotFound);

    nockDone();
  });

  it('Should throw bankConnectionNotFound if try to delete connection twice', async () => {
    const { nockDone } = await nockBack('deleteConnectionTwice.json');

    const bankConnection = await dependencies.signIn.execute({
      bankId: testConnector.uuid,
      userId: user.props.userId,
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

    const { connectionId, userId } = bankConnection.props;

    await dependencies.deleteBankConnection.execute({ userId, connectionId });

    const result = dependencies.deleteBankConnection.execute({ userId, connectionId });

    expect(result).rejects.toThrow(BankConnectionError.BankConnectionNotFound);
    nockDone();
  });

  it('should dispatch BANK_CONNECTION_DELETED', async () => {
    const { nockDone } = await nockBack('deleteConnection.json');

    const bankConnection = await dependencies.signIn.execute({
      bankId: testConnector.uuid,
      userId: user.props.userId,
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

    const eventDispatcherSpy = jest.spyOn(kernel.get(EventProducerDispatcher), 'dispatch');
    const { userId, connectionId } = bankConnection.props;

    await dependencies.deleteBankConnection.execute({
      userId,
      connectionId,
    });

    bankConnection.props = undefined;
    bankConnection.version = 1;
    expect(eventDispatcherSpy).toHaveBeenCalledWith(bankConnection);

    nockDone();
  });
});
