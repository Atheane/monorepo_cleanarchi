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

const waitForBackgroundConnectionSync = ms => new Promise(res => setTimeout(res, ms));

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures`);

describe('SignIn integration testing', () => {
  let dependencies: DomainDependencies;
  const testConnector = { uuid: '338178e6-3d01-564f-9a7b-52ca442459bf' };

  beforeAll(async () => {
    const kernel = new AggregationKernel(testConfiguration);
    await kernel.initDependencies(false);
    await initMongooseConnection(process.env.MONGO_URL);
    dependencies = kernel.getDependencies();
  });

  beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    const clearActions = [];
    for (const collection of collections) {
      clearActions.push(collection.deleteMany({}));
    }
    await Promise.all(clearActions);
  });

  afterAll(async () => {
    nock.cleanAll();
  });

  it('Should success on a valid signin', async () => {
    const { nockDone } = await nockBack('signin.json');
    const user = User.create({
      userId: 'user1',
      consent: true,
    });

    await dependencies.userRepository.create(user.props);

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
    nockDone();
  });

  it('Should return the same connection for a second signin', async () => {
    const { nockDone } = await nockBack('signintwice.json');

    const user = User.create({
      userId: 'user2',
      consent: true,
    });

    await dependencies.userRepository.create(user.props);

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

    const result = await dependencies.signIn.execute({
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

    expect(result.props.state).toEqual(ConnectionStateEnum.VALID);
    expect(result.props.active).toBeTruthy();
    expect(result.props.form).toBeFalsy();
    expect(result.props.connectionId).toEqual(props.connectionId);
    nockDone();
  });

  it('Should resolve an otp', async () => {
    const { nockDone } = await nockBack('otpResolve.json');

    const user = User.create({
      userId: 'user7',
      consent: true,
    });

    await dependencies.userRepository.create(user.props);

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

    const resultotp = await dependencies.completeSignInWithSca.execute({
      userId: user.props.userId,
      connectionId: props.connectionId,
      form: [
        {
          name: 'openapisms',
          value: 'abcd',
        },
      ],
    });

    expect(resultotp.props.state).toEqual(ConnectionStateEnum.VALID);
    expect(resultotp.props.active).toBeTruthy();
    expect(resultotp.props.form).toBeFalsy();

    nockDone();
  });

  it('should return connection at decoupled state if user tries to signin instead of resolving sca', async () => {
    const { nockDone } = await nockBack('signinWithDecoupledState.json');

    const user = User.create({
      userId: 'azekuayzefftaze',
      consent: true,
    });

    await dependencies.userRepository.create(user.props);

    const payload = {
      bankId: testConnector.uuid,
      userId: user.props.userId,
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
    };
    const bankConnection1stSignin = await dependencies.signIn.execute(payload);

    expect(bankConnection1stSignin.props.state).toEqual(ConnectionStateEnum.DECOUPLED);
    expect(bankConnection1stSignin.props.active).toBeTruthy();
    expect(bankConnection1stSignin.props.form).toBeUndefined();

    const bankConnection2ndSignin = await dependencies.signIn.execute(payload);
    expect(bankConnection2ndSignin).toEqual(bankConnection1stSignin);

    nockDone();
  });

  it('should complete a third party auth', async () => {
    const { nockDone } = await nockBack('thirdPartyAuth.json');

    const user = User.create({
      userId: 'user9',
      consent: true,
    });

    await dependencies.userRepository.create(user.props);

    const { props } = await dependencies.signIn.execute({
      bankId: testConnector.uuid,
      userId: user.props.userId,
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
    expect(props.form).toBeFalsy();

    const result = await dependencies.completeSignInWithSca.execute({
      connectionId: props.connectionId,
      userId: user.props.userId,
    });
    expect(result.props.state).toEqual(ConnectionStateEnum.VALIDATING);
    expect(result.props.active).toBeTruthy();
    expect(result.props.form).toBeFalsy();

    await waitForBackgroundConnectionSync(100);
    const updatedConnection = await dependencies.bankConnectionRepository.findBy({
      connectionId: props.connectionId,
    });
    expect(updatedConnection.props.state).toBe(ConnectionStateEnum.VALID);
    nockDone();
  });

  it('should be updated to SCARequired if thirdPartyAuth is cancelled by user', async () => {
    const { nockDone } = await nockBack('thirdPartyAuthCancelled.json');

    const user = User.create({
      userId: 'azebazhjgfycg',
      consent: true,
    });

    await dependencies.userRepository.create(user.props);

    const { props } = await dependencies.signIn.execute({
      bankId: testConnector.uuid,
      userId: user.props.userId,
      form: [
        {
          name: 'openapiwebsite',
          value: 'AppValidationCancelled',
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
    expect(props.form).toBeFalsy();

    const result = await dependencies.completeSignInWithSca.execute({
      connectionId: props.connectionId,
      userId: user.props.userId,
    });
    expect(result.props.state).toEqual(ConnectionStateEnum.VALIDATING);
    expect(result.props.active).toBeTruthy();
    expect(result.props.form).toBeFalsy();

    await waitForBackgroundConnectionSync(100);
    const updatedConnection = await dependencies.bankConnectionRepository.findBy({
      connectionId: props.connectionId,
    });
    expect(updatedConnection.props.state).toBe(ConnectionStateEnum.SCA);
    nockDone();
  });

  it('should be updated to SCARequired if thirdPartyAuth expires', async () => {
    const { nockDone } = await nockBack('thirdPartyAuthExpired.json');

    const user = User.create({
      userId: 'azebazhjgfycgazxazdea',
      consent: true,
    });

    await dependencies.userRepository.create(user.props);

    const { props } = await dependencies.signIn.execute({
      bankId: testConnector.uuid,
      userId: user.props.userId,
      form: [
        {
          name: 'openapiwebsite',
          value: 'AppValidationExpired',
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
    expect(props.form).toBeFalsy();

    const result = await dependencies.completeSignInWithSca.execute({
      connectionId: props.connectionId,
      userId: user.props.userId,
    });
    expect(result.props.state).toEqual(ConnectionStateEnum.VALIDATING);
    expect(result.props.active).toBeTruthy();
    expect(result.props.form).toBeFalsy();

    await waitForBackgroundConnectionSync(100);
    const updatedConnection = await dependencies.bankConnectionRepository.findBy({
      connectionId: props.connectionId,
    });
    expect(updatedConnection.props.state).toBe(ConnectionStateEnum.SCA);
    nockDone();
  });

  it('Should throw bank connection not found', async () => {
    const result = dependencies.bankConnectionRepository.findBy({ userId: 'unkown', bankId: 'unkown' });
    await expect(result).rejects.toThrow(BankConnectionError.BankConnectionNotFound);
  });
});
