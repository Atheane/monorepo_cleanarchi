import 'reflect-metadata';
import { InvitationMapper } from '@oney/authentication-adapters';
import {
  AuthIdentifier,
  DefaultDomainErrorMessages,
  InvitationState,
  RegisterValidateError,
  Channel,
  Invitation,
  RegisterValidate,
} from '@oney/authentication-core';
import * as express from 'express';
import { Application } from 'express';
import * as dateMock from 'jest-date-mock';
import * as nock from 'nock';
import * as request from 'supertest';
import * as path from 'path';
import { bootstrap } from './fixtures/bootstrap';
import { AppKernel } from '../config/di/AppKernel';

const app: Application = express();

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

describe('Register Validate integration api testing', () => {
  let container: AppKernel;
  let invitationToken: string;
  let invitationMapper: InvitationMapper;

  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/env/test.env');
    container = await bootstrap(envPath, process.env.MONGO_URL, process.env.MONGO_DB_NAME, app);
    invitationMapper = container.get<InvitationMapper>(AuthIdentifier.mappers.invitation);
  });

  beforeEach(async () => {
    nock('http://localhost:3022/profile/user').post(/.*/).reply(201);

    dateMock.clear();
  });

  it('Should return 401 cause not token provided', async () => {
    await request(app).post('/authentication/register/validate').expect(401);
  });

  it('Should return 400 when invalid email at register creation [POST /register/create]', async () => {
    const email = 'testuseffff@oney.com56';
    dateMock.advanceTo(new Date('08-05-1945'));
    await request(app).post('/authentication/register/create').send({ email }).expect(400);
  });

  it('Should return 400 cause token is invalid', async () => {
    await request(app)
      .post('/authentication/register/validate')
      .set('invitation_token', 'opazkeapzoe')
      .expect(400);
  });

  it('Should create the user from a valid invitation', async () => {
    const email = 'testussxsqer@oney.com';

    const invitation = await request(app).post('/authentication/register/create').send({
      email,
    });

    invitationToken = invitationMapper.fromDomain(invitation.body);
    await request(app)
      .post('/authentication/register/validate')
      .set('invitation_token', invitationToken)
      .expect(200)
      .expect(response => {
        const user = response.body;

        expect(user.email).toMatch(email);
        expect(user.phone).toBeFalsy();
        expect(user.pinCode.isSet).toBeFalsy();
      });
  });

  it('Should send a new invitation if expired', async () => {
    const email = 'testuser@oney.com';
    dateMock.advanceTo(new Date('08-05-1945'));

    const { body: invitation } = await request(app).post('/authentication/register/create').send({
      email,
    });

    dateMock.advanceTo(new Date('09-05-1945'));
    invitationToken = invitationMapper.fromDomain(invitation);
    await request(app)
      .post('/authentication/register/validate')
      .set('invitation_token', invitationToken)
      .expect(401)
      .expect(response => {
        expect(response.body.name).toMatch(RegisterValidateError.InvitationExpired.name);
      });
  });

  it('Should not create a user if the invitation does not exist', async () => {
    dateMock.advanceTo(new Date('08-05-1945'));
    invitationToken = invitationMapper.fromDomain({
      state: InvitationState.PENDING,
      email: 'apzoek',
      uid: 'zaekaze',
      createdAt: new Date(),
      updatedAt: new Date(),
      phone: null,
      channel: Channel.EMAIL,
    });

    await request(app)
      .post('/authentication/register/validate')
      .set('invitation_token', invitationToken)
      .expect(401)
      .expect(response => {
        expect(response.body.name).toMatch(RegisterValidateError.InvitationDoesNotExist.name);
      });
  });

  it('Should not create a user if the invitation is already completed [POST /register/validate]', async () => {
    const email = 'testuser@oney.com';
    dateMock.advanceTo(new Date('08-05-1945'));
    const { body: invitation } = await request(app).post('/authentication/register/create').send({
      email,
    });

    invitationToken = invitationMapper.fromDomain(invitation);

    await request(app).post('/authentication/register/validate').set('invitation_token', invitationToken);

    await request(app)
      .post('/authentication/register/validate')
      .set('invitation_token', invitationToken)
      .expect(401)
      .expect(response => {
        expect(response.body.name).toMatch(RegisterValidateError.InvitationAlreadyCompleted.name);
      });
  });

  it('Should return 401 when invitation already completed for user existing  [POST /register/validate]', async () => {
    // nock.cleanAll();

    const email = 'testuseffff@oney.com';
    dateMock.advanceTo(new Date('08-05-1945'));
    const { body: invitation } = await request(app).post('/authentication/register/create').send({
      email,
    });

    invitationToken = invitationMapper.fromDomain(invitation);

    await request(app).post('/authentication/register/validate').set('invitation_token', invitationToken);

    await request(app)
      .post('/authentication/register/validate')
      .set('invitation_token', invitationToken)
      .expect(401)
      .expect(response => {
        expect(response.body.code).toEqual(401);
        expect(response.body.name).toMatch(RegisterValidateError.InvitationAlreadyCompleted.name);
        expect(response.body.message).toMatch(DefaultDomainErrorMessages.INVITATION_ALREADY_COMPLETED);
      });
  });

  it('Should not create a user if ODB ACCOUNT create returns non-201 status [POST /register/validate]', async () => {
    nock.cleanAll();

    const email = 'testuser_1@oney.com';
    dateMock.advanceTo(new Date('08-05-1945'));
    const { body: invitation } = await request(app).post('/authentication/register/create').send({
      email,
    });
    const errorCode = 500;

    invitationToken = invitationMapper.fromDomain(invitation);

    nock('http://localhost:3022/profile/user').post(/.*/).reply(errorCode);

    await request(app)
      .post('/authentication/register/validate')
      .set('invitation_token', invitationToken)
      .expect(errorCode)
      .expect(response => {
        expect(response.body.code).toEqual(errorCode);
        expect(response.body.type).toMatch('ODB_ACCOUNT_USER_CREATION_FAILED');
        expect(response.body.message).toMatch(/User creation failed on odb-account with code \d+/);
      });
  });

  it('Should not create a user if ODB ACCOUNT does not respond [POST /register/validate]', async () => {
    nock.cleanAll();

    const email = 'testuser_2@oney.com';
    dateMock.advanceTo(new Date('08-05-1945'));
    const { body: invitation } = await request(app).post('/authentication/register/create').send({
      email,
    });
    const errorCode = 404;

    invitationToken = invitationMapper.fromDomain(invitation);

    nock('http://localhost:3022/profile/user').post(/.*/).reply(404);

    await request(app)
      .post('/authentication/register/validate')
      .set('invitation_token', invitationToken)
      .expect(errorCode)
      .expect(response => {
        expect(response.body.code).toEqual(errorCode);
      });
  });

  it('Should not create a user if invitation is not completed [POST /register/validate]', async () => {
    nock.cleanAll();

    const email = 'testuser_3@oney.com';
    dateMock.advanceTo(new Date('08-05-1945'));
    const { body: invitation } = await request(app).post('/authentication/register/create').send({
      email,
    });
    const errorCode = 401;

    invitationToken = invitationMapper.fromDomain(invitation);

    const mock = jest.spyOn(RegisterValidate.prototype, 'execute').mockImplementation(() => {
      return Promise.resolve(
        new Invitation({
          channel: Channel.EMAIL,
          email,
          uid: 'reert',
          state: InvitationState.PENDING,
        }),
      );
    });

    await request(app)
      .post('/authentication/register/validate')
      .set('invitation_token', invitationToken)
      .expect(errorCode)
      .expect(response => {
        expect(response.body.code).toEqual(errorCode);
        expect(response.body.name).toEqual(RegisterValidateError.InvitationNotCompleted.name);
        expect(response.body.message).toEqual(DefaultDomainErrorMessages.INVITATION_NOT_COMPLETED);
      });

    mock.mockRestore();
  });
});
