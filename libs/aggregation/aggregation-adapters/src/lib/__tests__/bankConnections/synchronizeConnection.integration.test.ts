import * as mongoose from 'mongoose';
import * as nock from 'nock';
import { BankConnection, ConnectionStateEnum, BankConnectionError, User } from '@oney/aggregation-core';
import * as path from 'path';
import { BankConnectionModel } from '../../adapters/repositories/mongodb/models';
import { UserModel } from '../../adapters/repositories/mongodb/models/UserModel';
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

describe('Synchronize connection integration testing', () => {
  let dependencies: DomainDependencies;
  const testConnector = { uuid: '338178e6-3d01-564f-9a7b-52ca442459bf' };

  let bankConnection: BankConnection;
  let user: User;
  beforeAll(async () => {
    const kernel = new AggregationKernel(testConfiguration);
    await kernel.initDependencies(false);
    await initMongooseConnection(process.env.MONGO_URL);
    dependencies = kernel.getDependencies();
    user = User.create({
      userId: 'azeazaeaeae',
      consent: true,
    });
    await dependencies.userRepository.create(user.props);
    bankConnection = new BankConnection({
      connectionId: 'naojzkbldljkabzeljk',
      userId: user.props.userId,
      bankId: 'f711dd7a-6289-5bda-b3a4-f2febda8c046',
      refId: '1327',
      active: true,
      state: ConnectionStateEnum.SCA,
      form: null,
      connectionDate: new Date(),
    });
  });

  beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    const clearActions = [];
    for (const collection of collections) {
      clearActions.push(collection.deleteMany({}));
    }
    await Promise.all(clearActions);
    await new UserModel(user.props).save();
    await new BankConnectionModel(bankConnection.props).save();
  });

  afterAll(async () => {
    nock.cleanAll();
  });

  it('should throw bank connection not found', async () => {
    const result = dependencies.synchronizeConnection.execute({
      refId: 'razeaze',
      state: 'unknown',
      active: true,
    });

    await expect(result).rejects.toThrow(BankConnectionError.BankConnectionNotFound);
  });

  it('should return a connection with fields in form', async () => {
    const { nockDone } = await nockBack('getConnectionByRefId.json');

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

    const connection = await dependencies.bankConnectionRepository.findBy({ refId: props.refId });

    expect(connection.props.state).toEqual(ConnectionStateEnum.MORE_INFORMATION);
    expect(connection.props.active).toBeTruthy();
    expect(connection.props.form).toBeTruthy();
    expect(connection.props.form[0].name).toEqual('openapisms');
    nockDone();
  });
});
