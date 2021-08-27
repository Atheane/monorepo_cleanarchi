import * as mongoose from 'mongoose';
import * as nock from 'nock';
import { BankConnectionError, ConnectionStateEnum, User } from '@oney/aggregation-core';
import * as path from 'path';
import { initMongooseConnection } from '../../adapters/services/MongoService';
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

describe('Get a connection by id integration testing', () => {
  let dependencies: DomainDependencies;
  const testConnector = { uuid: '338178e6-3d01-564f-9a7b-52ca442459bf' };
  let user: User;
  beforeAll(async () => {
    const kernel = new AggregationKernel(testConfiguration);
    await kernel.initDependencies(false);
    dependencies = kernel.getDependencies();
    await initMongooseConnection(process.env.MONGO_URL);
  });

  beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    const clearActions = [];
    for (const collection of collections) {
      clearActions.push(collection.deleteMany({}));
    }
    await Promise.all(clearActions);
    user = User.create({
      userId: 'azeazhgauipzeaz',
      consent: true,
    });
    await dependencies.userRepository.create(user.props);
  });

  afterAll(async () => {
    nock.cleanAll();
  });

  it('Should get a valid connection', async () => {
    const { nockDone } = await nockBack('signin.json');
    const { props } = await dependencies.signIn.execute({
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
    expect(props.state).toEqual(ConnectionStateEnum.VALID);
    expect(props.active).toBeTruthy();
    expect(props.form).toBeFalsy();

    const connection = await dependencies.getConnectionById.execute({
      userId: props.userId,
      connectionId: props.connectionId,
    });

    expect(connection.props.form).toBeFalsy();
    nockDone();
  });

  it('Should get an otp connection', async () => {
    const { nockDone } = await nockBack('otp.json');

    const { props } = await dependencies.signIn.execute({
      bankId: testConnector.uuid,
      userId: user.props.userId,
      form: [
        {
          name: 'openapiwebsite',
          value: 'additionalInformationNeeded',
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

    expect(props.state).toEqual(ConnectionStateEnum.MORE_INFORMATION);
    expect(props.active).toBeTruthy();
    expect(props.form).toBeTruthy();

    const connection = await dependencies.getConnectionById.execute({
      userId: props.userId,
      connectionId: props.connectionId,
    });

    expect(connection.props.form).toBeTruthy();
    nockDone();
  });

  it('should throw bankConnection not found', async () => {
    const { nockDone } = await nockBack('bankConnectionNotFound.json');

    const { props } = await dependencies.signIn.execute({
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

    const result = dependencies.getConnectionById.execute({
      userId: props.userId,
      connectionId: 'unkown',
    });
    await expect(result).rejects.toThrow(BankConnectionError.BankConnectionNotFound);
    nockDone();
  });
});
