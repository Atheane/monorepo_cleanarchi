import { ProfileGenerator, ShortIdGenerator } from '@oney/profile-adapters';
import { ProfileStatus } from '@oney/profile-messages';
import * as express from 'express';
import { Application } from 'express';
import { Container } from 'inversify';
import * as request from 'supertest';
import * as nock from 'nock';
import { EncodeIdentity, IdentityProvider, ServiceName } from '@oney/identity-core';
import * as path from 'path';
import { configureApp, initRouter } from '../config/server/express';

const app: Application = express();

jest.spyOn(ShortIdGenerator.prototype, 'generateUniqueID').mockImplementation(() => 'uniqueIdUnitTest');
jest.spyOn(Date.prototype, 'getFullYear').mockImplementation(() => 1990);
jest.spyOn(Date.prototype, 'getMonth').mockImplementation(() => 1);
jest.spyOn(Date.prototype, 'getDate').mockImplementation(() => 4);

describe('Verify Bank Account Owner api testing', () => {
  let saveFixture: Function;
  let container: Container;
  let encodeIdentity: EncodeIdentity;
  let userId: string;
  let serviceToken: string;

  beforeAll(async () => {
    userId = 'QsDfgHjKln';
    const envPath = path.resolve(__dirname + '/env/test.env');
    container = await configureApp(envPath, true);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    encodeIdentity = container.get(EncodeIdentity);
    serviceToken = await encodeIdentity.execute({
      provider: IdentityProvider.odb,
      uid: 'aggregation',
      email: '',
      providerId: ServiceName.aggregation,
    });
    await initRouter(app, envPath);
    const profileDb = container.get(ProfileGenerator);
    await profileDb.generate(userId, ProfileStatus.ACTIVE);
  });

  beforeEach(async () => {
    nock.restore();
    nock.activate();
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/verifyBankAccountOwner`);
    nock.back.setMode('record');
    const { nockDone } = await nock.back(test.getFixtureName());
    saveFixture = nockDone;
  });

  afterEach(async () => {
    const nockObjects = nock.recorder.play();
    if (nockObjects.length == 0) {
      nock.restore();
    } else {
      console.log('saving nock fixture for: ', test.getFixtureName());
      saveFixture();
    }
  });

  it('Should return true when verifying bank', async () => {
    nock.enableNetConnect(/127\.0\.0\.1/);
    await request(app)
      .post(`/profile/user/${userId}/verify-bankaccount-owner`)
      .set('Authorization', `Bearer ${serviceToken}`)
      .send({
        identity: 'TOTO identity',
        lastName: 'Mazen',
        firstName: 'Mazendk',
        birthDate: '1990-01-01',
        bankName: 'Boursorama',
      })
      .expect(200)
      .expect(response => {
        expect(response.body).toEqual({ isOwnerBankAccount: true });
      });
  });

  it('Should return true when verifying bank even if only identity and bankName are sent', async () => {
    nock.enableNetConnect(/127\.0\.0\.1/);
    await request(app)
      .post(`/profile/user/${userId}/verify-bankaccount-owner`)
      .set('Authorization', `Bearer ${serviceToken}`)
      .send({
        identity: 'Mazen Mazendk',
        bankName: 'Boursorama',
      })
      .expect(200)
      .expect(response => {
        expect(response.body).toEqual({ isOwnerBankAccount: true });
      });
  });

  it('Should return 400 if mandatory content is not sent', async () => {
    nock.enableNetConnect(/127\.0\.0\.1/);
    await request(app)
      .post(`/profile/user/${userId}/verify-bankaccount-owner`)
      .set('Authorization', `Bearer ${serviceToken}`)
      .send({})
      .expect(400);
  });

  it('Should return 401 if not authorized with user token', async () => {
    nock.enableNetConnect(/127\.0\.0\.1/);
    const userToken = await encodeIdentity.execute({
      provider: IdentityProvider.odb,
      email: 'nacimiphone8@yopmail.com',
      uid: userId,
    });
    await request(app)
      .post(`/profile/user/${userId}/verify-bankaccount-owner`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        identity: 'TOTO identity',
        lastName: 'TOTO familyName',
        firstName: 'TOTO givenName',
        birthDate: '1990-01-01',
        bankName: 'Boursorama',
      })
      .expect(401);
  });
});
