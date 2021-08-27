import 'reflect-metadata';
import './mocks/azureBus.mock';
import * as express from 'express';
import * as request from 'supertest';
import { Container } from 'inversify';
import { EncodeIdentity, IdentityProvider } from '@oney/identity-core';
import { OfferType } from '@oney/subscription-messages';
import * as path from 'path';
import { bootstrap } from '../config/bootstrap';

const app = express();

describe('INTEGRATION - OfferApi', () => {
  let container: Container;
  let token: string;
  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/../env/test.env');
    container = await bootstrap(app, envPath, process.env.MONGO_URL);
  });

  beforeEach(async () => {
    token = await container.get(EncodeIdentity).execute({
      uid: 'pazez',
      email: 'opazke',
      providerId: null,
      provider: IdentityProvider.odb,
    });
  });

  it('Should get all offers', async () => {
    await request(app)
      .get('/subscription/offers')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(response => {
        const offerType = response.body.map(item => item.type);
        expect(offerType.includes(OfferType.ONEY_FIRST)).toBeTruthy();
        expect(offerType.includes(OfferType.ONEY_ORIGINAL)).toBeTruthy();
        expect(offerType.includes(OfferType.ACCOUNT_FEE)).toBeFalsy();
        expect(offerType.includes(OfferType.VISA_PREMIER)).toBeFalsy();
        expect(offerType.includes(OfferType.VISA_CLASSIC)).toBeFalsy();
      });
  });

  it('Should get Oney+ Original offer', async () => {
    await request(app)
      .get('/subscription/offers/0d84b88b-e93a-4de7-b52e-44eacd9e7b18')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(response => {
        expect(response.body.name).toEqual('Original');
      });
  });

  it('Should get notFound error', async () => {
    await request(app)
      .get('/subscription/offers/qffzefz')
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });
});
