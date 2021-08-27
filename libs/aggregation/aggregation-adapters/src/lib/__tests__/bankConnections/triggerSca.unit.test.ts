import { BankConnection, BankConnectionError, ConnectionStateEnum } from '@oney/aggregation-core';
import * as nock from 'nock';
import * as dateMock from 'jest-date-mock';
import * as path from 'path';
import { bankConnectionProps } from './fixtures/bankConnectionProps';
import { BudgetInsightConnectionState } from '../../adapters/partners/budgetinsights';
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

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures`);
// nockBack.setMode('record');
describe('Trigger SCA unit test', () => {
  let dependencies: DomainDependencies;
  let kernel: AggregationKernel;
  let saveFixture: Function;
  const userId = 'K-oZktdWv';
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

  it('Should trigger SCA and require thirdParty auth', async () => {
    await createUser(kernel, userId);
    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.SCA_THEN_OTP));
    await aggregateAccounts(kernel, userId, bankConnection);

    await dependencies.synchronizeConnection.execute({
      refId: bankConnection.props.refId,
      state: BudgetInsightConnectionState.SCA_REQUIRED,
      active: false,
    });

    const connection = await dependencies.triggerSca.execute({
      userId,
      connectionId: bankConnection.props.connectionId,
    });

    expect(connection.props.state).toEqual(ConnectionStateEnum.MORE_INFORMATION);
  });

  it('should throw NoScaRequired', async () => {
    await createUser(kernel, userId);
    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.VALID));

    const result = dependencies.triggerSca.execute({
      userId,
      connectionId: bankConnection.props.connectionId,
    });

    await expect(result).rejects.toThrow(BankConnectionError.NoScaRequired);
  });

  it('should return the connection if in decoupled state', async () => {
    await createUser(kernel, userId);
    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.DECOUPLED));

    const result = await dependencies.triggerSca.execute({
      userId,
      connectionId: bankConnection.props.connectionId,
    });
    expect(result.props).toEqual(bankConnection.props);
  });

  it('should return the connection if in moreInformation state', async () => {
    await createUser(kernel, userId);
    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.OTP));

    const result = await dependencies.triggerSca.execute({
      userId,
      connectionId: bankConnection.props.connectionId,
    });

    expect(result.props).toEqual(bankConnection.props);
  });

  it('should throw API_RESPONSE_ERROR', async () => {
    nock('https://oney-dev-sandbox.biapi.pro/2.0')
      .post(`/users/me/connections/${bankConnectionProps.refId}`)
      .replyWithError('awful error');

    const bankConnection = new BankConnection(bankConnectionProps);

    const result = dependencies.scaConnectionGateway.triggerSca(bankConnection);
    await expect(result).rejects.toThrow(BankConnectionError.ApiResponseError);
  });
});
