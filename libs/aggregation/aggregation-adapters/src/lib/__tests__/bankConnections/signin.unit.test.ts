import { expect, it, describe, beforeAll } from '@jest/globals';
import { EventProducerDispatcher } from '@oney/messages-core';
import * as nock from 'nock';
import {
  BankConnectionError,
  BankError,
  ConnectionStateEnum,
  User,
  UserProvider,
} from '@oney/aggregation-core';
import * as path from 'path';
import { bankConnectionFields } from './fixtures/bankConnectionFieldsWithRegexpOnListType';
import { AggregationKernel } from '../../di/AggregationKernel';
import { DomainDependencies } from '../../di/DomainDependencies';
import { testConfiguration } from '../config';
import { PP2ReveConnectionService } from '../../adapters/partners/pp2Reve/PP2ReveConnectionService';

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
nockBack.setMode('record');

describe('SignIn unit testing', () => {
  let dependencies: DomainDependencies;
  const testConnector = { uuid: '338178e6-3d01-564f-9a7b-52ca442459bf' };
  let kernel: AggregationKernel;

  beforeAll(async () => {
    kernel = new AggregationKernel(testConfiguration);
    await kernel.initDependencies(true);
    dependencies = kernel.getDependencies();
  });

  afterAll(() => {
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

  it('Should failed on sign in', async () => {
    const { nockDone } = await nockBack('requestFailed.json');

    const result = dependencies.signIn.execute({
      bankId: testConnector.uuid,
      userId: 'user1',
      form: [
        {
          name: 'openapiwebsite',
          value: 'azpodkzaodk',
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
    await expect(result).rejects.toThrow(BankConnectionError.ApiResponseError);
    nockDone();
  });

  it('Should fail the bank id is missing', async () => {
    const { nockDone } = await nockBack('bankNotFound.json');

    const result = dependencies.signIn.execute({
      bankId: null,
      userId: 'user1',
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

    await expect(result).rejects.toThrow(BankError.BankNotFound);
    nockDone();
  });

  it('Should fail if wrong password is given', async () => {
    const { nockDone } = await nockBack('wrongpass.json');

    const user = User.create({
      userId: 'user4',
      consent: true,
    });

    await dependencies.userRepository.create(user.props);

    const result = dependencies.signIn.execute({
      bankId: testConnector.uuid,
      userId: user.props.userId,
      form: [
        {
          name: 'openapiwebsite',
          value: 'wrongpass',
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

    await expect(result).rejects.toThrow(BankConnectionError.WrongPassword);
    nockDone();
  });

  it('Should fail if password has expired', async () => {
    const { nockDone } = await nockBack('passwordExpired.json');

    const user = User.create({
      userId: 'user5',
      consent: true,
    });

    await dependencies.userRepository.create(user.props);

    const result = dependencies.signIn.execute({
      bankId: testConnector.uuid,
      userId: user.props.userId,
      form: [
        {
          name: 'openapiwebsite',
          value: 'passwordExpired',
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
    await expect(result).rejects.toThrow(BankConnectionError.WrongPassword);
    nockDone();
  });

  it('Should throw action needed', async () => {
    const { nockDone } = await nockBack('actionNeeded.json');

    const user = User.create({
      userId: 'user6',
      consent: true,
    });

    await dependencies.userRepository.create(user.props);

    const result = dependencies.signIn.execute({
      bankId: testConnector.uuid,
      userId: user.props.userId,
      form: [
        {
          name: 'openapiwebsite',
          value: 'actionNeeded',
        },
        {
          name: 'directaccesswebsite',
          value: 'actionNeeded',
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

    await expect(result).rejects.toThrow(BankConnectionError.ActionNeeded);
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
      userId: 'user7',
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
    expect(bankConnection1stSignin.props.form).toBeNull();

    const bankConnection2ndSignin = await dependencies.signIn.execute(payload);
    expect(bankConnection2ndSignin).toEqual(bankConnection1stSignin);

    nockDone();
  });

  it('Should throw wrong pass in an otp', async () => {
    const { nockDone } = await nockBack('otpWrongpassword.json');

    const user = User.create({
      userId: 'user8',
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

    const resultotp = dependencies.completeSignInWithSca.execute({
      userId: 'user8',
      connectionId: props.connectionId,
      form: [
        {
          name: 'openapisms',
          value: 'abc',
        },
      ],
    });

    await expect(resultotp).rejects.toThrow(BankConnectionError.WrongPassword);

    nockDone();
  });

  const waitForBackgroundConnectionSync = ms => new Promise(res => setTimeout(res, ms));

  it('should complete a third party auth', async () => {
    const { nockDone } = await nockBack('thirdPartyAuth.json');
    const eventDispatcherSpy = jest.spyOn(kernel.get(EventProducerDispatcher), 'dispatch');

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
      userId: 'user9',
    });
    expect(result.props.state).toEqual(ConnectionStateEnum.VALIDATING);
    expect(result.props.active).toBeTruthy();
    expect(result.props.form).toBeFalsy();

    await waitForBackgroundConnectionSync(100);
    const updatedConnection = await dependencies.bankConnectionRepository.findBy({
      connectionId: props.connectionId,
    });
    expect(updatedConnection.props.state).toBe(ConnectionStateEnum.VALID);
    expect(eventDispatcherSpy).toHaveBeenCalledWith(result);
    nockDone();
  });

  it('should complete a third party auth for pp de reve user and send result to callback url', async () => {
    const { nockDone } = await nockBack('thirdPartyAuthPP2Reve.json');

    const user = User.create({
      userId: 'user_PP_DE_REVE',
      consent: true,
    });

    await dependencies.userRepository.create(user.props);

    user.update({ provider: UserProvider.PP_DE_REVE });

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
      form: [
        {
          name: 'url_callback',
          value: 'http://56b253026414.ngrok.io/sca_pp_2_reve',
        },
      ],
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

  it('should throw field validation failure if a malformed url is sent', async () => {
    const { nockDone } = await nockBack('thirdPartyAuthPP2ReveBadCallbackURL.json');

    const user = User.create({
      userId: 'user_PP_DE_REVE2',
      consent: true,
    });

    await dependencies.userRepository.create(user.props);

    user.update({ provider: UserProvider.PP_DE_REVE });

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

    const result = dependencies.completeSignInWithSca.execute({
      connectionId: props.connectionId,
      userId: user.props.userId,
      form: [
        {
          name: 'url_callback',
          value: 'malformed_url',
        },
      ],
    });

    await expect(result).rejects.toThrow(BankConnectionError.FieldValidationFailure);
    nockDone();
  });

  it('should retry if first call fails', async () => {
    const { nockDone } = await nockBack('pp2RevePostScaRetry.json');

    const user = User.create({
      userId: 'user_PP_DE_REVE3',
      consent: true,
    });

    await dependencies.userRepository.create(user.props);

    user.update({ provider: UserProvider.PP_DE_REVE });

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
    const result = await dependencies.scaConnectionGateway.postScaResult(
      bankConnection,
      'http://56b253026414.ngrok.io/page_does_not_exists',
    );

    expect(result).toBeUndefined();

    nockDone();
  });

  it('should send bankConnection once AF is completed', async () => {
    const { nockDone } = await nockBack('postBankConnectionSCAToPP2Reve.json');

    const eventDispatcherSpy = jest.spyOn(kernel.get(PP2ReveConnectionService), 'postScaResult');

    const user = User.create({
      userId: 'user_PP_DE_REVE4',
      consent: true,
    });

    await dependencies.userRepository.create(user.props);

    user.update({ provider: UserProvider.PP_DE_REVE });

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
    const result = await dependencies.scaConnectionGateway.postScaResult(
      bankConnection,
      'http://56b253026414.ngrok.io/sca_pp_2_reve',
    );

    expect(result).toBeUndefined();
    expect(eventDispatcherSpy).toHaveBeenCalledTimes(1);
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

  it('should throw no scaRequired', async () => {
    const { nockDone } = await nockBack('noScaRequired.json');

    const user = User.create({
      userId: 'user10',
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

    const result = dependencies.completeSignInWithSca.execute({
      connectionId: props.connectionId,
      userId: 'user10',
    });
    await expect(result).rejects.toThrow(BankConnectionError.NoScaRequired);
    nockDone();
  });

  it('Should throw APIresponseError when otp authentication', async () => {
    const { nockDone } = await nockBack('otpRequestFailed.json');

    const user = User.create({
      userId: 'user11',
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

    const resultotp = dependencies.completeSignInWithSca.execute({
      userId: 'user11',
      connectionId: props.connectionId,
      form: [
        {
          name: 'openapisms',
          value: 'aaaa',
        },
      ],
    });

    await expect(resultotp).rejects.toThrow(BankConnectionError.ApiResponseError);

    nockDone();
  });

  it('Should return a regexp for list type fields', async () => {
    const result = await dependencies.mappers.bankConnectionMapper.toDomain(bankConnectionFields);
    expect(result.props.form[0].validation).toEqual(/^[0-9]+$/);
  });

  it('Should throw bank connection not found', async () => {
    const result = dependencies.bankConnectionRepository.findBy({ userId: 'unkown', bankId: 'unkown' });
    await expect(result).rejects.toThrow(BankConnectionError.BankConnectionNotFound);
  });

  it('Should dispatch BANK_CONNECTION_UPDATED if signed in twice', async () => {
    const { nockDone } = await nockBack('signintwice.json');
    const eventDispatcherSpy = jest.spyOn(kernel.get(EventProducerDispatcher), 'dispatch');

    const user = User.create({
      userId: 'AAAAAAAA',
      consent: true,
    });

    await dependencies.userRepository.create(user.props);

    await dependencies.signIn.execute({
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

    expect(eventDispatcherSpy).toHaveBeenCalledWith({
      ...bankConnection,
      version: 1,
    });

    nockDone();
  });
});
