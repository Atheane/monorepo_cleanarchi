import 'reflect-metadata';
import {
  AuthenticationError,
  AuthFactor,
  AuthStatus,
  Channel,
  DomainDependencies,
  Email,
  Invitation,
  StrongAuthVerifier,
  User,
  UserError,
  UserRepository,
  VerifierRepository,
} from '@oney/authentication-core';
import { VerifierServiceName } from '../../adapters/decorators/verifiers';
import { AuthenticationBuildDependencies } from '../../di/AuthenticationBuildDependencies';
import { initializeInMemoryAuthenticationBuildDependencies } from '../fixtures/initializeInMemoryAuthenticationBuildDependencies';
import { testConfiguration } from '../fixtures/config/config';

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

describe('StrongCustomerAuthentication usecases integration testing', () => {
  let verifierId: string;
  let userRepo: UserRepository;
  let emailUserId: string;
  let smsUserId: string;
  let verifierRepo: VerifierRepository;
  let pinVerifierId: string;
  let kernel: AuthenticationBuildDependencies;
  let dependencies: DomainDependencies;
  let emailUserFactor: string;

  beforeAll(async () => {
    //  await SecretService.loadSecrets();
    emailUserId = '1243';
    smsUserId = '547';
    emailUserFactor = 'hello@oney.com';
    const verifierMap = new Map<string, StrongAuthVerifier>();
    const invitationMap = new Map<string, Invitation>();
    const userMap = new Map<string, User>();
    userMap.set(
      emailUserId,
      new User({
        uid: emailUserId,
        pinCode: null,
        email: Email.from(emailUserFactor),
        phone: null,
      }),
    );

    const configuration = {
      ...testConfiguration,
      useIcgSmsAuthFactor: false,
    };

    kernel = (
      await initializeInMemoryAuthenticationBuildDependencies({
        configuration,
        userMap,
        verifierMap,
        invitationMap,
      })
    ).kernel;

    dependencies = kernel.getDependencies();

    verifierRepo = dependencies.verifierRepository;
    userRepo = dependencies.userRepository;
  });

  it('Should create a user with email channel', async () => {
    // Given
    const user = new User({
      uid: smsUserId,
      pinCode: null,
      email: Email.from('hello@oney.fr'),
      phone: '0612345678',
    });
    // When
    const result = await userRepo.save(user);
    // Then
    expect(result).toMatchObject(user);
  });

  it('Should generate SMS verifier', async () => {
    // use ODB verifier gateway for non-ICG SMS abstraction
    const spy = jest
      .spyOn<any, any>(dependencies.verifierService, 'toggleScaProvider')
      .mockImplementationOnce(() => VerifierServiceName.ODB);

    const result = await dependencies.requestSca.execute({
      userId: smsUserId,
    });
    expect(result.factor).toMatch(AuthFactor.OTP);
    expect(result.channel).toMatch(Channel.SMS);
    expect(result.status).toMatch(AuthStatus.PENDING);
    expect(result.valid).toBeFalsy();
    expect(result.metadatas).toMatchObject({ otpLength: 8 });

    // restore non-mock implementation
    spy.mockRestore();
  });

  it('Should generate EMAIL verifier', async () => {
    const result = await dependencies.requestSca.execute({
      userId: emailUserId,
    });
    verifierId = result.verifierId;
    expect(result.factor).toMatch(AuthFactor.OTP);
    expect(result.channel).toMatch(Channel.EMAIL);
    expect(result.status).toMatch(AuthStatus.PENDING);
    expect(result.valid).toBeFalsy();
    expect(result.metadatas).toBeFalsy();
  });

  it('Should throw USER_NOT_FOUND', async () => {
    const result = dependencies.requestSca.execute({
      userId: '2f5r',
    });

    await expect(result).rejects.toThrow(UserError.UserNotFound);
  });

  it('Should verify credentials based on credentials and throw error cause bad credentials entered', async () => {
    const result = dependencies.verifyCredentials.execute({
      verifierId,
      credential: '1234',
    });
    await expect(result).rejects.toThrow(AuthenticationError.BadCredentials);
  });

  it('Should return false cause verifier is non valid', async () => {
    const result = await dependencies.requestVerifier.execute({
      verifierId,
    });
    expect(result.valid).toBeFalsy();
  });

  it('Should return null cause verifier does not exist', async () => {
    const result = dependencies.requestVerifier.execute({
      verifierId: 'iamtheverifier',
    });
    await expect(result).rejects.toThrow(AuthenticationError.VerifierNotFound);
  });

  it('Should throw error on verify cause verifier does not exist', async () => {
    const result = dependencies.verifyCredentials.execute({
      verifierId: 'iamtheverifier',
      credential: '8742524',
    });

    await expect(result).rejects.toThrow(AuthenticationError.VerifierNotFound);
  });

  it('Should verify credentials based on credentials and return true cause good credentials entered', async () => {
    const result = await dependencies.verifyCredentials.execute({
      verifierId,
      credential: '00000000',
    });
    expect(result.valid).toBeTruthy();
    expect(result.status).toBe(AuthStatus.DONE);
  });

  it('Should return that the auth is valid when requesting verifierrrrrr', async () => {
    const result = await dependencies.requestVerifier.execute({
      verifierId,
    });
    expect(result.valid).toBeTruthy();
  });

  it('Should update a user with a bad PIN factor', async () => {
    // Given
    const result = dependencies.setPinCode.execute({
      userId: emailUserId,
      pinCode: {
        value: 'ssss',
        deviceId: 'aaabbb',
      },
    });
    // Then
    await expect(result).rejects.toThrow(UserError.NonValidDigitPinCode);
  });

  it('Should update a user with PIN factor', async () => {
    // Given
    const command = {
      userId: emailUserId,
      pinCode: { value: '123456', deviceId: 'aaabbb' },
    };
    const user = await dependencies.setPinCode.execute(command);
    const { email } = user.props;
    // Then
    expect(email.address).toMatch(emailUserFactor);
    expect(user.props.uid).toMatch(emailUserId);
    expect(user.props.pinCode).toBeTruthy();
  });

  it('Should request PinCode authent mode', async () => {
    const result = await dependencies.requestSca.execute({
      userId: emailUserId,
    });
    expect(result.factor).toMatch(AuthFactor.PIN_CODE);
    expect(result.channel).toBeNull();
    expect(result.status).toMatch(AuthStatus.PENDING);
    expect(result.valid).toBeFalsy();
    pinVerifierId = result.verifierId;
  });

  it('Should verify PIN Code with Failure', async () => {
    const result = dependencies.verifyCredentials.execute({
      verifierId: pinVerifierId,
      credential: 'azeazeazeaeaze',
    });
    await expect(result).rejects.toThrow(AuthenticationError.BadCredentials);
  });

  it('Should verify PIN Code with Success', async () => {
    const result = await dependencies.verifyCredentials.execute({
      verifierId: pinVerifierId,
      credential: JSON.stringify({ deviceId: 'aaabbb', value: '123456' }),
    });
    expect(result.valid).toBeTruthy();
    expect(result.status).toBe(AuthStatus.DONE);
  });

  it('Should Bypass PinCode authent mode', async () => {
    const result = await dependencies.requestSca.execute({
      userId: emailUserId,
      byPassPinCode: true,
    });
    expect(result.factor).toMatch(AuthFactor.OTP);
    expect(result.channel).toMatch(Channel.EMAIL);
    expect(result.status).toMatch(AuthStatus.PENDING);
    expect(result.valid).toBeFalsy();
    pinVerifierId = result.verifierId;
  });

  it('Should resolve with an expired verifier', async () => {
    // GIVEN
    await verifierRepo.save(
      new StrongAuthVerifier({
        factor: AuthFactor.OTP,
        channel: Channel.EMAIL,
        expirationDate: new Date('02-05-2020'),
        valid: false,
        status: AuthStatus.PENDING,
        verifierId: 'verifierExpired',
        credential: '00000000',
        customer: {
          uid: 'userVerifierExpired',
          email: 'zzzz',
        },
      }),
    );

    // WHEN
    await dependencies.verifyCredentials.execute({
      verifierId: 'verifierExpired',
      credential: '00000000',
    });

    const result = await dependencies.requestVerifier.execute({
      verifierId: 'verifierExpired',
    });

    // THEN
    expect(result.status).toMatch(AuthStatus.EXPIRED);
    expect(result.valid).toBeFalsy();
  });

  it('Should trigger and resolved sca with Password factor', async () => {
    // Given
    const command = {
      userId: emailUserId,
      password: '123456',
    };
    const user = await dependencies.provisionUserPassword.execute(command);
    const { email } = user.props;

    expect(email.address).toMatch(emailUserFactor);
    expect(user.props.uid).toMatch(emailUserId);
    expect(user.props.password).toBeTruthy();

    // Then
    const result = await dependencies.requestSca.execute({
      userId: emailUserId,
    });
    expect(result.factor).toEqual(AuthFactor.PASSWORD);
    expect(result.valid).toBeFalsy();
    expect(result.status).toEqual(AuthStatus.PENDING);

    // Non-passing case.
    const badPassword = dependencies.verifyCredentials.execute({
      verifierId: result.verifierId,
      credential: '123465',
    });

    await expect(badPassword).rejects.toThrow(UserError.PasswordNotValid);

    // Passing-case.
    const verify = await dependencies.verifyCredentials.execute({
      verifierId: result.verifierId,
      credential: '123456',
    });
    expect(verify.status).toEqual(AuthStatus.DONE);
    expect(verify.valid).toBeTruthy();
  });

  afterAll(async done => {
    done();
  });
});
