/* eslint-env jest */
import 'reflect-metadata';
import { Identifiers, KycDecisionType, ProfileRepositoryRead } from '@oney/profile-core';
import { Context } from '@azure/functions';
import { OdbProfileRepositoryRead, ProfileGenerator, ProfileMapper } from '@oney/profile-adapters';
import { ACCEPTED, INTERNAL_SERVER_ERROR } from 'http-status';
import { Container } from 'inversify';
import { ProfileStatus } from '@oney/profile-messages';
import { otCallbackPayload } from './fixtures/kycDecisionPayload';
import { configureDbClient } from '../config/build';
import httpTrigger from '../index';

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

const container = new Container();

describe('Process Oneytrust callback unit testing', () => {
  beforeAll(async () => {
    const dbClient = await configureDbClient(container, {
      mongoUrl: process.env.MONGO_URL,
      mongoCollection: 'users',
    });
    await configureDbClient(container, {
      mongoUrl: process.env.MONGO_URL,
      mongoCollection: 'ot_events',
    });
    container.bind(ProfileGenerator).toConstantValue(new ProfileGenerator(dbClient.dbWrite));
    container
      .bind<ProfileRepositoryRead>(Identifiers.profileRepositoryRead)
      .toConstantValue(new OdbProfileRepositoryRead(dbClient.dbRead, new ProfileMapper()));
    await container
      .get(ProfileGenerator)
      .generate('uid', ProfileStatus.ON_HOLD, 'SP_202118_ujHGEuTJO_0YOY0Whiv');
  });

  it('Should handle callback and return 202', async () => {
    const context = {
      req: {
        headers: {
          host: 'test.com',
        } as any,
        url: '/the-incredible-url',
        body: otCallbackPayload,
      },
      log: () => undefined,
      done: () => undefined,
    } as Context;

    //Act
    await httpTrigger(context, context.req);

    expect(context.res.error).toBeUndefined();
    expect(context.res.status).toEqual(ACCEPTED);
  });

  it('Should handle callback and return body error', async () => {
    const context = {
      req: {
        headers: {
          host: 'test.com',
        } as any,
        url: '/the-incredible-url',
        body: {},
      },
      log: () => undefined,
      done: () => undefined,
    } as Context;

    await httpTrigger(context, context.req);

    expect(context.res.status).toEqual(INTERNAL_SERVER_ERROR);
    expect(context.res.error).toEqual('Invalid request body');
  });

  it('Should handle callback and return profile not found error', async () => {
    const context = {
      req: {
        headers: {
          host: 'test.com',
        } as any,
        url: '/the-incredible-url',
        body: {
          ...otCallbackPayload,
          caseReference: 'wrong',
          decision: KycDecisionType.PENDING_ADDITIONAL_INFO,
        },
      },
      log: () => undefined,
      done: () => undefined,
    } as Context;

    await httpTrigger(context, context.req);

    expect(context.res.status).toEqual(INTERNAL_SERVER_ERROR);
    expect(context.res.error).toEqual('PROFILE_NOT_FOUND');
  });
});
