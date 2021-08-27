import { ProfileGenerator, OneyB2BContractGateway } from '@oney/profile-adapters';
import { Steps } from '@oney/profile-core';
import { ProfileStatus } from '@oney/profile-messages';
import * as express from 'express';
import { Application } from 'express';
import { Container } from 'inversify';
import * as request from 'supertest';
import { EncodeIdentity, IdentityProvider } from '@oney/identity-core';
import { DocumentGenerator } from '@oney/document-generator';
import * as nock from 'nock';
import * as path from 'path';
import { configureApp, initRouter } from '../config/server/express';

const app: Application = express();
const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures/signContract`);
nockBack.setMode('record');

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

describe('sign contract api testing', () => {
  let userToken: string;
  let container: Container;
  let userId: string;
  let spyUpdateOneyFRContract: jest.SpyInstance;
  let spyDocumentGeneratorSave: jest.SpyInstance;
  let spyDocumentGeneratorGenerate: jest.SpyInstance;

  beforeAll(async () => {
    userId = 'AWzclPFyN';
    const envPath = path.resolve(__dirname + '/env/test.env');
    container = await configureApp(envPath, true);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    await initRouter(app, envPath);
    spyDocumentGeneratorGenerate = jest
      .spyOn(DocumentGenerator.prototype, 'generate')
      .mockImplementation(() => Promise.resolve(new DocumentGenerator('', true)));
    spyDocumentGeneratorSave = jest
      .spyOn(DocumentGenerator.prototype, 'save')
      .mockImplementation(() => Promise.resolve(true));
    spyUpdateOneyFRContract = jest.spyOn(OneyB2BContractGateway.prototype, 'update');
  });

  beforeEach(() => {
    spyDocumentGeneratorSave.mockClear();
    spyDocumentGeneratorGenerate.mockClear();
    spyUpdateOneyFRContract.mockClear();
  });

  it('should sign contract and update OF', async () => {
    const { nockDone } = await nockBack('contractSignedEventHandler.json');
    nock.enableNetConnect(/127\.0\.0\.1/);
    const profileDb = container.get(ProfileGenerator);
    const identityEncode = container.get(EncodeIdentity);
    const user = await profileDb.generate(userId, ProfileStatus.ON_BOARDING);
    userToken = await identityEncode.execute({
      uid: user.id,
      email: user.props.email,
      provider: IdentityProvider.odb,
    });
    await profileDb.beforeContractStepSnapshot(userId);
    await request(app)
      .post('/profile/AWzclPFyN/onboarding/step/contract')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        date: '2021-02-10T18:57:56.708Z',
      })
      .expect(200)
      .expect(response => {
        expect(response.body.steps.includes(Steps.CONTRACT_STEP)).toBeFalsy();
        expect(response.body.contract_signed_at).toEqual('2021-02-10T18:57:56.708Z');
      });

    await request(app)
      .get('/profile/user/AWzclPFyN')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(response => {
        expect(response.body.steps.length).toEqual(0);
      });

    expect(spyUpdateOneyFRContract).toBeCalledWith({
      bankAccountId: '3915',
      date: '2021-02-10T18:57:56.708Z',
    });

    nockDone();
  });

  it('should not sign contract when user is not authorized', async () => {
    const profileDb = container.get(ProfileGenerator);
    const identityEncode = container.get(EncodeIdentity);
    const user = await profileDb.beforeCivilStatusSnapshot(userId);
    userToken = await identityEncode.execute({
      uid: 'wrong-id',
      email: user.props.email,
      provider: IdentityProvider.odb,
    });
    await request(app)
      .post('/profile/AWzclPFyN/onboarding/step/contract')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        date: '2021-02-10T18:57:56.708Z',
      })
      .expect(401);
  });
});
