import * as nock from 'nock';
import { BankConnection } from '@oney/aggregation-core';
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

describe('getConnectionsOwnedByUser usecase', () => {
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

  afterEach(() => {
    const nockObjects = nock.recorder.play();
    if (nockObjects.length == 0) {
      nock.restore();
    } else {
      console.log('saving nock fixture for: ', testIt.getFixtureName());
      saveFixture();
    }
  });

  it('should return connections', async () => {
    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.VALID));

    const { bankAccounts: accountsNotAggregated } = await dependencies.getAccountsByConnectionId.execute({
      userId: bankConnection.props.userId,
      connectionId: bankConnection.props.connectionId,
    });

    const formattedAccounts = accountsNotAggregated.map(account => ({
      id: account.props.id,
      name: account.props.name,
      aggregated: true,
    }));

    const aggregatedAccounts = await dependencies.aggregateAccounts.execute({
      userId: bankConnection.props.userId,
      connectionId: bankConnection.props.connectionId,
      accounts: [formattedAccounts[0]],
    });

    const { bankConnections } = await dependencies.getConnectionsOwnedByUser.execute({
      userId,
    });

    expect(bankConnections.length).toEqual(1);
    expect(bankConnections[0].props.connectionId).toEqual(bankConnection.props.connectionId);
    expect(bankConnections[0].props.accounts.length).toEqual(aggregatedAccounts.length);
    expect(bankConnections[0].props.accounts[0].id).toEqual(aggregatedAccounts[0].id);

    await dependencies.deleteBankConnection.execute({
      connectionId: bankConnection.props.connectionId,
      userId,
    });
  });

  it('should return empty connection.accounts[] when user does not have any account for a connection', async () => {
    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.OTP));

    const {
      bankConnections,
    }: { bankConnections: BankConnection[] } = await dependencies.getConnectionsOwnedByUser.execute({
      userId: bankConnection.props.userId,
    });

    expect(bankConnections[0].props.accounts).toEqual([]);
    await dependencies.deleteBankConnection.execute({
      connectionId: bankConnection.props.connectionId,
      userId,
    });
  });

  it('should return empty connections[] when user has no connections', async () => {
    const {
      bankConnections,
    }: { bankConnections: BankConnection[] } = await dependencies.getConnectionsOwnedByUser.execute({
      userId,
    });

    expect(bankConnections).toEqual([]);
  });
});
