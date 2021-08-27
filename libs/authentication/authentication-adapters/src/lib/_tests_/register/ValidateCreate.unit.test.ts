/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { DomainDependencies, InvitationState, RegisterValidateError } from '@oney/authentication-core';
import * as dateMock from 'jest-date-mock';
import * as nock from 'nock';
import { AuthenticationBuildDependencies } from '../../di/AuthenticationBuildDependencies';
import { testConfiguration } from '../fixtures/config/config';
import { initializeInMemoryAuthenticationBuildDependencies } from '../fixtures/initializeInMemoryAuthenticationBuildDependencies';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

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

describe('ValidateCreate usecases integration testing', () => {
  let kernel: AuthenticationBuildDependencies;
  let dependencies: DomainDependencies;

  beforeAll(async () => {
    kernel = (await initializeInMemoryAuthenticationBuildDependencies()).kernel;

    dependencies = kernel.getDependencies();
  });

  beforeEach(async () => {
    nock(`${testConfiguration.frontDoorApiBaseUrl}/profile/user`).persist().post(/.*/).reply(201);
  });

  it('Should complete an invitation and create a user', async () => {
    const email = 'testuser_1@oney.com';
    dateMock.advanceTo(new Date('08-05-1945'));

    const invitation = await dependencies.registerCreate.execute({ email });
    const invitationCompleted = await dependencies.registerValidate.execute({ invitationId: invitation.uid });
    const cpmmand = { email: invitationCompleted.email, associateProfile: false, metadata: { type: 'ODB' } };
    const user = await dependencies.signUpUser.execute(cpmmand);
    const { metadata, phone, email: userEmail } = user.props;

    expect(invitationCompleted.state).toEqual(InvitationState.COMPLETED);
    expect(metadata['type']).toEqual('ODB');
    expect(userEmail.address).toMatch(invitationCompleted.email);
    expect(phone).toBeFalsy();
  });

  it('Should send a new invitation if expired', async () => {
    const email = 'testuser_2@oney.com';
    dateMock.advanceTo(new Date('08-05-1945'));

    const invitation = await dependencies.registerCreate.execute({ email });

    dateMock.advanceTo(new Date('09-05-1945'));
    const resultPromise = dependencies.registerValidate.execute({ invitationId: invitation.uid });

    await expect(resultPromise).rejects.toThrow(RegisterValidateError.InvitationExpired);
  });

  it('Should not create a user if the invitation does not exist', async () => {
    dateMock.advanceTo(new Date('08-05-1945'));
    const userPromise = dependencies.registerValidate.execute({ invitationId: '1234' });

    await expect(userPromise).rejects.toThrow(RegisterValidateError.InvitationDoesNotExist);
  });

  it('Should not create a user if the invitation is already completed', async () => {
    const email = 'testuser_3@oney.com';
    dateMock.advanceTo(new Date('08-05-1945'));
    const invitation = await dependencies.registerCreate.execute({ email });
    await dependencies.registerValidate.execute({ invitationId: invitation.uid });
    const command = { email: invitation.email, associateProfile: true };
    await dependencies.signUpUser.execute(command);
    const resultPromise = dependencies.registerValidate.execute({ invitationId: invitation.uid });

    await expect(resultPromise).rejects.toThrow(RegisterValidateError.InvitationAlreadyCompleted);
  });

  afterAll(async done => {
    nock.cleanAll();
    done();
  });
});
