/**
 * @jest-environment node
 */
import 'reflect-metadata';
import {
  DomainDependencies,
  Email,
  InvitationState,
  RegisterCreateError,
  User,
} from '@oney/authentication-core';
import * as dateMock from 'jest-date-mock';
import { AuthenticationBuildDependencies } from '../../di/AuthenticationBuildDependencies';
import { initializeInMemoryAuthenticationBuildDependencies } from '../fixtures/initializeInMemoryAuthenticationBuildDependencies';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

jest.mock('@azure/service-bus', () => {
  return {
    ReceiveMode: {
      peekLock: 1,
      receiveAndDelete: 2,
    },
    ServiceBusClient: {
      createFromConnectionString: jest.fn().mockReturnValue({
        name: 'AzureBus',
        createTopicClient: jest.fn().mockReturnValue({
          createSender: jest.fn().mockReturnValue({
            send: jest.fn(),
          }),
        }),
        createSubscriptionClient: jest.fn().mockReturnValue({
          addRule: jest.fn(),
          createReceiver: jest.fn().mockReturnValue({
            registerMessageHandler: jest.fn(),
            receiveMessages: jest.fn().mockReturnValue([]),
          }),
        }),
      }),
    },
  };
});

describe('RegisterCreate usecases integration testing', () => {
  let kernel: AuthenticationBuildDependencies;
  let dependencies: DomainDependencies;

  beforeAll(async () => {
    kernel = (await initializeInMemoryAuthenticationBuildDependencies()).kernel;

    dependencies = kernel.getDependencies();
  });

  beforeEach(async () => {
    dateMock.clear();
  });

  it('Should send an invitation if the user does not exist', async () => {
    const email = 'testuser@oney.com';
    dateMock.advanceTo(new Date('08-05-1945'));
    const result = await dependencies.registerCreate.execute({ email });

    expect(result.email).toEqual(email);
    expect(result.createdAt).toEqual(new Date('08-05-1945'));
    expect(result.updatedAt).toEqual(new Date('08-05-1945'));
    expect(result.state).toEqual(InvitationState.PENDING);
  });

  it('Should send an invitation with phone', async () => {
    const phone = '0612345687';
    dateMock.advanceTo(new Date('08-05-1945'));
    const result = await dependencies.registerCreate.execute({ phone, email: null });
    console.log(result);
    expect(result.phone).toEqual(phone);
    expect(result.createdAt).toEqual(new Date('08-05-1945'));
    expect(result.updatedAt).toEqual(new Date('08-05-1945'));
    expect(result.state).toEqual(InvitationState.PENDING);
  });

  it('Should throw error cause trying to send email and phone which has not been verified', async () => {
    const phone = '0612345687';
    dateMock.advanceTo(new Date('08-05-1945'));
    const result = dependencies.registerCreate.execute({ phone, email: 'email@email.com' });
    await expect(result).rejects.toThrow(RegisterCreateError.PhoneNotVerified);
  });

  it('Should send the same invitation twice if not expired', async () => {
    const email = 'testuser@oney.com';
    dateMock.advanceTo(new Date('08-05-1945'));
    const firstExec = await dependencies.registerCreate.execute({ email });

    expect(firstExec.email).toEqual(email);
    expect(firstExec.createdAt).toEqual(new Date('08-05-1945'));
    expect(firstExec.updatedAt).toEqual(new Date('08-05-1945'));
    expect(firstExec.state).toEqual(InvitationState.PENDING);

    const secondExec = await dependencies.registerCreate.execute({ email });

    expect(firstExec).toEqual(secondExec);
  });

  it('Should send a new invitation if the first one is expired', async () => {
    dateMock.advanceTo(new Date('08-05-1945'));
    const email = 'testuser@oney.com';
    let firstInvitationId = null;

    const firstExec = await dependencies.registerCreate.execute({ email });
    firstInvitationId = firstExec.uid;
    expect(firstExec.email).toEqual(email);
    expect(firstExec.createdAt).toEqual(new Date('08-05-1945'));
    expect(firstExec.updatedAt).toEqual(new Date('08-05-1945'));
    expect(firstExec.state).toEqual(InvitationState.PENDING);

    dateMock.advanceTo(new Date('09-05-1945'));
    const secondExec = await dependencies.registerCreate.execute({ email });
    // Then
    const updatedFirstInvitation = await dependencies.invitationRepository.findById(firstInvitationId);
    expect(secondExec.uid).not.toMatch(firstInvitationId);
    expect(updatedFirstInvitation.state).toMatch(InvitationState.EXPIRED);
    expect(updatedFirstInvitation.updatedAt).toEqual(new Date('09-05-1945'));

    expect(secondExec.email).toEqual(email);
    expect(secondExec.createdAt).toEqual(new Date('09-05-1945'));
    expect(secondExec.updatedAt).toEqual(new Date('09-05-1945'));
    expect(secondExec.state).toEqual(InvitationState.PENDING);
  });

  it('Should not send a new invitation if the user already exist [POST] /register', async () => {
    // Given
    const email = Email.from('testuser@oney.com');
    const user = new User({ uid: '1234', pinCode: null, email: email, phone: '0612345678' });
    await dependencies.userRepository.save(user);

    const result = dependencies.registerCreate.execute({ email: email.address });

    await expect(result).rejects.toThrow(RegisterCreateError.UserAlreadyExist);
  });

  afterAll(async done => {
    done();
  });
});
