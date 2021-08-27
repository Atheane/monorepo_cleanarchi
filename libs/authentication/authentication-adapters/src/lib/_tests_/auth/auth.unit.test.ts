/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { AuthenticationError, DomainDependencies, Email, User, UserError } from '@oney/authentication-core';
import * as dateMock from 'jest-date-mock';
import * as moment from 'moment';
import { AuthenticationBuildDependencies } from '../../di/AuthenticationBuildDependencies';
import { initializeInMemoryAuthenticationBuildDependencies } from '../fixtures/initializeInMemoryAuthenticationBuildDependencies';

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
    }),
  },
}));

describe('User Authentication testing', () => {
  let kernel: AuthenticationBuildDependencies;
  let dependencies: DomainDependencies;
  let email: Email;
  let userId: string;
  let userMap: Map<string, User>;
  beforeAll(async () => {
    userMap = new Map<string, User>();
    email = Email.from('hello@oneyr.co');
    userId = '1147458';
    userMap.set(
      userId,
      new User({
        uid: userId,
        pinCode: null,
        email,
        phone: null,
      }),
    );

    kernel = (await initializeInMemoryAuthenticationBuildDependencies({ userMap })).kernel;

    dependencies = kernel.getDependencies();
  });

  beforeEach(() => {
    dateMock.clear();
  });

  it('Should find an email', async () => {
    // GIVEN
    const emailGiven = email.address;

    // WHEN
    const { props } = await dependencies.signIn.execute({
      email: emailGiven,
    });

    // THEN
    expect(props.email.address).toMatch(emailGiven);
    expect(props.uid).toMatch(userId);
  });

  it('Should block user and prevent signin', async () => {
    // GIVEN
    const emailGiven = email.address;
    await dependencies.blockUser.execute({
      uid: userId,
    });

    // WHEN
    dateMock.advanceTo(moment().add(1, 'day').toDate());
    const result = dependencies.signIn.execute({
      email: emailGiven,
    });

    // THEN
    await expect(result).rejects.toThrow(AuthenticationError.AccountBlocked);
  });

  it('Should throw error cause email not found', async () => {
    // GIVEN
    const emailGiven = 'notfound@404.com';

    // WHEN
    const result = dependencies.signIn.execute({
      email: emailGiven,
    });

    // THEN
    await expect(result).rejects.toThrow(UserError.UserNotFound);
  });

  afterAll(async done => {
    done();
  });
});
