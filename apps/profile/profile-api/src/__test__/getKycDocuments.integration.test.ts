import { Container } from 'inversify';
import { ProfileGenerator } from '@oney/profile-adapters';
import * as express from 'express';
import { Application } from 'express';
import { EncodeIdentity, IdentityProvider } from '@oney/identity-core';
import * as request from 'supertest';
import { Profile } from '@oney/profile-core';
import { ProfileStatus } from '@oney/profile-messages';
import * as path from 'path';
import { kycDocuments } from './fixtures/resources/kycDocuments';
import { configureApp, initRouter } from '../config/server/express';

const app: Application = express();

describe('getKycDocuments integration test', () => {
  const userId = 'beGe_flCm';

  let container: Container;
  let user: Profile;
  let identityEncode;

  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/env/test.env');
    container = await configureApp(envPath, true);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    await initRouter(app, envPath);
    identityEncode = container.get(EncodeIdentity);
    const profileDb = container.get(ProfileGenerator);
    user = await profileDb.generate(userId, ProfileStatus.ON_HOLD);
  });

  it('should return kyc documents referential list', async () => {
    const userToken = await identityEncode.execute({
      uid: user.id,
      email: user.props.email,
      provider: IdentityProvider.odb,
    });
    await request(app)
      .get(`/profile/resources/kyc-document`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)
      .expect(res => {
        expect(res.body[0]).toEqual(kycDocuments);
      });
  });
});
