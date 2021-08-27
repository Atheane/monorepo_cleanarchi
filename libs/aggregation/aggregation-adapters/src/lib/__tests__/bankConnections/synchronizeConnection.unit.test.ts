import * as nock from 'nock';
import { BankConnectionError, ConnectionStateEnum, User } from '@oney/aggregation-core';
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

describe('Synchronize connection unit testing', () => {
  let dependencies: DomainDependencies;
  const testConnector = { uuid: '338178e6-3d01-564f-9a7b-52ca442459bf' };
  const userId = 'kazjndkjqsdfsd';

  beforeAll(async () => {
    const kernel = new AggregationKernel(testConfiguration);
    await kernel.initDependencies(true);
    dependencies = kernel.getDependencies();
    const user = User.create({
      userId,
      consent: true,
    });
    await dependencies.userRepository.create(user.props);
  });

  afterAll(() => {
    nock.cleanAll();
  });

  it('should update bank connection state to valid', async () => {
    const { nockDone } = await nockBack('syncToValidConnection.json');

    const { props } = await dependencies.signIn.execute({
      bankId: testConnector.uuid,
      userId,
      form: [
        {
          name: 'openapiwebsite',
          value: 'shortDecoupled',
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

    expect(props.state).toEqual(ConnectionStateEnum.DECOUPLED);
    expect(props.active).toBeTruthy();
    expect(props.form).toBeNull();

    // simulate Budget Insight webhook
    const bankConnection = await dependencies.synchronizeConnection.execute({
      refId: props.refId,
      state: null,
      active: true,
    });

    expect(bankConnection.props.state).toEqual(ConnectionStateEnum.VALID);

    const bankConnectionRefresh = await dependencies.getConnectionById.execute({
      userId: bankConnection.props.userId,
      connectionId: bankConnection.props.connectionId,
    });

    expect(bankConnectionRefresh).toEqual(bankConnection);

    nockDone();
  });

  it('should update bank connection state to actionNeeded', async () => {
    const { nockDone } = await nockBack('syncToActionNeeded.json');
    const { props } = await dependencies.signIn.execute({
      bankId: testConnector.uuid,
      userId,
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

    expect(props.state).toEqual(ConnectionStateEnum.VALID);
    expect(props.active).toBeTruthy();
    expect(props.form).toBeNull();

    // simulate Budget Insight webhook
    const bankConnection = await dependencies.synchronizeConnection.execute({
      refId: props.refId,
      state: 'actionNeeded',
      active: true,
    });

    expect(bankConnection.props.state).toEqual(ConnectionStateEnum.ACTION_NEEDED);
    nockDone();
  });

  it('should update bank connection state to SCA', async () => {
    const { nockDone } = await nockBack('syncToSca.json');
    const { props } = await dependencies.signIn.execute({
      bankId: testConnector.uuid,
      userId,
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

    expect(props.state).toEqual(ConnectionStateEnum.VALID);
    expect(props.active).toBeTruthy();
    expect(props.form).toBeNull();

    // simulate Budget Insight webhook
    const bankConnection = await dependencies.synchronizeConnection.execute({
      refId: props.refId,
      state: 'SCARequired',
      active: true,
    });

    expect(bankConnection.props.state).toEqual(ConnectionStateEnum.SCA);
    nockDone();
  });

  it('should update bank connection state to Password Expired', async () => {
    const { nockDone } = await nockBack('syncToPasswordExpired.json');
    const { props } = await dependencies.signIn.execute({
      bankId: testConnector.uuid,
      userId,
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

    expect(props.state).toEqual(ConnectionStateEnum.VALID);
    expect(props.active).toBeTruthy();
    expect(props.form).toBeNull();

    // simulate Budget Insight webhook
    const bankConnection = await dependencies.synchronizeConnection.execute({
      refId: props.refId,
      state: 'passwordExpired',
      active: true,
    });

    expect(bankConnection.props.state).toEqual(ConnectionStateEnum.PASSWORD_EXPIRED);
    nockDone();
  });

  it('should update bank connection state to Password Expired if wrongpass', async () => {
    const { nockDone } = await nockBack('syncToPasswordExpiredIfWrongPass.json');
    const { props } = await dependencies.signIn.execute({
      bankId: testConnector.uuid,
      userId,
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

    expect(props.state).toEqual(ConnectionStateEnum.VALID);
    expect(props.active).toBeTruthy();
    expect(props.form).toBeNull();

    // simulate Budget Insight webhook
    const bankConnection = await dependencies.synchronizeConnection.execute({
      refId: props.refId,
      state: 'wrongpass',
      active: true,
    });

    expect(bankConnection.props.state).toEqual(ConnectionStateEnum.PASSWORD_EXPIRED);
    nockDone();
  });

  it('should update bank connection state to Error', async () => {
    const { nockDone } = await nockBack('syncToError.json');
    const { props } = await dependencies.signIn.execute({
      bankId: testConnector.uuid,
      userId,
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

    expect(props.state).toEqual(ConnectionStateEnum.VALID);
    expect(props.active).toBeTruthy();
    expect(props.form).toBeNull();

    // simulate Budget Insight webhook
    const bankConnection = await dependencies.synchronizeConnection.execute({
      refId: props.refId,
      state: 'bug',
      active: true,
    });

    expect(bankConnection.props.state).toEqual(ConnectionStateEnum.ERROR);
    nockDone();
  });

  it('should throw an unknown bank connection state', async () => {
    const { nockDone } = await nockBack('syncToUnknown.json');
    const { props } = await dependencies.signIn.execute({
      bankId: testConnector.uuid,
      userId,
      form: [
        {
          name: 'openapiwebsite',
          value: 'shortDecoupled',
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

    expect(props.state).toEqual(ConnectionStateEnum.DECOUPLED);
    expect(props.active).toBeTruthy();
    expect(props.form).toBeNull();

    // simulate Budget Insight webhook
    const result = dependencies.synchronizeConnection.execute({
      refId: props.refId,
      state: 'unknown',
      active: true,
    });

    await expect(result).rejects.toThrow(BankConnectionError.StateUnknown);
    nockDone();
  });

  it('should throw bank connection not found', async () => {
    const result = dependencies.synchronizeConnection.execute({
      refId: 'razeaze',
      state: 'unknown',
      active: true,
    });

    await expect(result).rejects.toThrow(BankConnectionError.BankConnectionNotFound);
  });
});
