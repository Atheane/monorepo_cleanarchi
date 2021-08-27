import 'reflect-metadata';
import {
  AuthIdentifier,
  Email,
  Channel,
  InvitationRepository,
  InvitationState,
  User,
  UserRepository,
} from '@oney/authentication-core';
import { Application } from 'express';
import * as express from 'express';
import * as dateMock from 'jest-date-mock';
import * as mongoose from 'mongoose';
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

describe('Register integration api testing', () => {
  let container: AppKernel;
  let invitationRepository: InvitationRepository;
  let userRepository: UserRepository;
  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/env/test.env');
    container = await bootstrap(envPath, process.env.MONGO_URL, process.env.MONGO_DB_NAME, app);
    invitationRepository = container.get<InvitationRepository>(AuthIdentifier.invitationRepository);
    userRepository = container.get<UserRepository>(AuthIdentifier.userRepository);
  });

  beforeEach(async () => {
    dateMock.clear();
    const collections = await mongoose.connection.db.collections();
    const clearActions = [];
    for (const collection of collections) {
      clearActions.push(collection.deleteMany({}));
    }
    await Promise.all(clearActions);
  });

  it('Should send an invitation if the user does not exist [POST] /register', async () => {
    // Given
    dateMock.advanceTo(new Date('08-05-1945'));
    const email = 'testuser@oney.com';

    // When
    return request(app)
      .post('/authentication/register/create')
      .send({
        email,
      })
      .expect(201)
      .expect(response => {
        // Then
        const { body } = response;
        expect(body.email).toEqual(email);
        expect(body.createdAt).toEqual(new Date('08-05-1945').toISOString());
        expect(body.updatedAt).toEqual(new Date('08-05-1945').toISOString());
        expect(body.state).toEqual(InvitationState.PENDING);
      });
  });

  it('Should send the same invitation twice if not expired [POST] /register', async () => {
    // Given
    dateMock.advanceTo(new Date('08-05-1945'));
    const email = 'testuser@oney.com';
    let firstInvitationId = null;

    // When
    await request(app)
      .post('/authentication/register/create')
      .send({
        email,
      })
      .expect(201)
      .expect(response => {
        // Then
        const { body } = response;
        firstInvitationId = body.uid;
        expect(body.email).toEqual(email);
        expect(body.createdAt).toEqual(new Date('08-05-1945').toISOString());
        expect(body.updatedAt).toEqual(new Date('08-05-1945').toISOString());
        expect(body.state).toEqual(InvitationState.PENDING);
      });

    return request(app)
      .post('/authentication/register/create')
      .send({
        email,
      })
      .expect(201)
      .expect(response => {
        // Then
        const { body } = response;
        expect(body.uid).toMatch(firstInvitationId);
        expect(body.email).toEqual(email);
        expect(body.createdAt).toEqual(new Date('08-05-1945').toISOString());
        expect(body.updatedAt).toEqual(new Date('08-05-1945').toISOString());
        expect(body.state).toEqual(InvitationState.PENDING);
      });
  });

  it('Should send a new invitation if the first one is expired [POST] /register', async () => {
    // Given
    dateMock.advanceTo(new Date('08-05-1945'));
    const email = 'testuser@oney.com';
    let firstInvitationId = null;

    // When
    const { status: firstReqStatusCode, body: firstReqBody } = await request(app)
      .post('/authentication/register/create')
      .send({
        email,
      });

    expect(firstReqStatusCode).toEqual(201);
    firstInvitationId = firstReqBody.uid;
    expect(firstReqBody.email).toEqual(email);
    expect(firstReqBody.createdAt).toEqual(new Date('08-05-1945').toISOString());
    expect(firstReqBody.updatedAt).toEqual(new Date('08-05-1945').toISOString());
    expect(firstReqBody.state).toEqual(InvitationState.PENDING);

    dateMock.advanceTo(new Date('09-05-1945'));

    const { status: secReqStatusCode, body: secReqBody } = await request(app)
      .post('/authentication/register/create')
      .send({
        email,
      });
    // Then
    const updatedFirstInvitation = await invitationRepository.findById(firstInvitationId);

    expect(secReqStatusCode).toEqual(201);
    expect(secReqBody.uid).not.toMatch(firstInvitationId);
    expect(updatedFirstInvitation.state).toMatch(InvitationState.EXPIRED);
    expect(updatedFirstInvitation.updatedAt).toEqual(new Date('09-05-1945'));

    expect(secReqBody.email).toEqual(email);
    expect(secReqBody.createdAt).toEqual(new Date('09-05-1945').toISOString());
    expect(secReqBody.updatedAt).toEqual(new Date('09-05-1945').toISOString());
    expect(secReqBody.state).toEqual(InvitationState.PENDING);
  });

  it('Should not send a new invitation if the user already exist [POST] /register', async () => {
    // Given
    const email = Email.from('testuser@oney.com');

    // When
    const props = { uid: '1234', email, phone: '0612345678', pinCode: null };
    await userRepository.save(new User(props));

    const { status, body } = await request(app).post('/authentication/register/create').send({
      email: email.address,
    });

    expect(status).toEqual(409);
    expect(body).toEqual({
      error: 'USER_ALREADY_EXIST',
    });
  });

  it('Should not send a new invitation if the user try to send email and phone for first time [POST] /register', async () => {
    // Given
    const email = 'testuser@oney.com';

    const { status, body } = await request(app).post('/authentication/register/create').send({
      email,
      phone: '+33678546958',
    });
    expect(status).toEqual(401);
    expect(body).toEqual({
      name: 'PhoneNotVerified',
    });
  });

  it('Should send an invitation by sms [POST] /register', async () => {
    // Given
    const phone = '+33675659874';
    const { body } = await request(app).post('/authentication/register/create').send({
      phone,
    });
    expect(body.email).toBeFalsy();
    expect(body.phone).toEqual(phone);
    expect(body.channel).toEqual(Channel.SMS);
  });

  it('Should accept phone and email cause phone invitation exist [POST] /register', async () => {
    // Given
    const phone = '+33612345827';
    const { body } = await request(app)
      .post('/authentication/register/create')
      .send({
        phone,
      })
      .expect(resp => console.log(resp));
    expect(body.email).toBeFalsy();
    expect(body.phone).toEqual(phone);
    expect(body.channel).toEqual(Channel.SMS);

    const result = await request(app).post('/authentication/register/create').send({
      phone,
      email: 'paoze@jkjh.com',
    });
    expect(result.body.email).toEqual('paoze@jkjh.com');
    expect(result.body.phone).toEqual(phone);
    expect(result.body.channel).toEqual(Channel.EMAIL);
  });

  it('Should get 400 cause either email or phone is provided [POST] /register', async () => {
    // Given
    await request(app).post('/authentication/register/create').expect(400);
  });

  it('Should get 400 cause phone is invalid [POST] /register', async () => {
    // Given
    await request(app)
      .post('/authentication/register/create')
      .send({
        phone: '123456',
      })
      .expect(400);
  });
});
