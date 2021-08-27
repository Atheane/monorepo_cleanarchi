import 'reflect-metadata';
import './mocks/azureBus.mock';
import * as express from 'express';
import * as request from 'supertest';
import { Container } from 'inversify';
import { EncodeIdentity, IdentityProvider } from '@oney/identity-core';
import { ActivateSubscription, EnrollSubscriber, ProcessSubscription } from '@oney/subscription-core';
import { v4 } from 'uuid';
import { SubscriptionStatus } from '@oney/subscription-messages';
import * as path from 'path';
import { bootstrap } from '../config/bootstrap';
import { SubscriptionSyms } from '../../config/di/SubscriptionSyms';

const app = express();

describe('INTEGRATION - SubscriptionApi', () => {
  let container: Container;
  let token: string;
  let subscriberId: string;
  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/../env/test.env');
    container = await bootstrap(app, envPath, process.env.MONGO_URL);
  });

  beforeEach(async () => {
    subscriberId = v4() + new Date().getTime().toString();
    const identityEncoded = await container.get(EncodeIdentity).execute({
      uid: subscriberId,
      email: 'opazke',
      providerId: null,
      provider: IdentityProvider.odb,
    });
    await container.get(EnrollSubscriber).execute({
      uid: subscriberId,
    });
    token = identityEncoded;
  });

  it('Should Subscribe to offer', async () => {
    await request(app)
      .post('/subscription')
      .send({
        uid: subscriberId,
        offerId: '0d84b88b-e93a-4de7-b52e-44eacd9e7b18',
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect(response => {
        expect(response.body.offerId).toEqual('0d84b88b-e93a-4de7-b52e-44eacd9e7b18');
      });
  });

  it('Should Subscribe to default Offer', async () => {
    const defaultOffer = container.get<string>(SubscriptionSyms.defaultOffer);
    await request(app)
      .post('/subscription')
      .send({
        uid: subscriberId,
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect(response => {
        expect(response.body.offerId).toEqual(defaultOffer);
      });
  });

  it('Should throw a 400 cause subscriber does not exist', async () => {
    await request(app)
      .post('/subscription')
      .send({
        uid: 'notFound',
        offerId: '0d84b88b-e93a-4de7-b52e-44eacd9e7b18',
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });

  it('Should throw a 400 cause subscriberId is null', async () => {
    const token = await container.get(EncodeIdentity).execute({
      uid: 'pazez',
      email: 'opazke',
      providerId: null,
      provider: IdentityProvider.odb,
    });
    await request(app)
      .post('/subscription')
      .send({
        offerId: '0d84b88b-e93a-4de7-b52e-44eacd9e7b18',
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });

  it('Should cancel subscription', async () => {
    // GIVEN
    const offerId = '0d84b88b-e93a-4de7-b52e-44eacd9e7b18';
    await request(app)
      .post('/subscription')
      .send({
        uid: subscriberId,
        offerId,
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect(response => {
        expect(response.body.offerId).toEqual(offerId);
      });

    // WHEN
    await request(app)
      .delete(`/subscription/${subscriberId}/${offerId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(response => {
        //THEN
        expect(response.body.status).toEqual(SubscriptionStatus.CANCELLED);
        expect(response.body.endDate).toBeTruthy();
      });

    // NotFoundCase
    await request(app)
      .delete(`/subscription/${subscriberId}/azeaze`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);

    // Rbac Case.
    const badToken = await container.get(EncodeIdentity).execute({
      uid: 'userId',
      email: 'opazke',
      providerId: null,
      provider: IdentityProvider.odb,
    });

    await request(app)
      .delete(`/subscription/${subscriberId}/${offerId}`)
      .set('Authorization', `Bearer ${badToken}`)
      .expect(401);
  });

  it('Should get subscriptions', async () => {
    // GIVEN
    const offerId = '0d84b88b-e93a-4de7-b52e-44eacd9e7b18';
    await request(app)
      .post('/subscription')
      .send({
        uid: subscriberId,
        offerId,
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect(response => {
        expect(response.body.offerId).toEqual(offerId);
      });

    await request(app)
      .get(`/subscription/${subscriberId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(resp => {
        expect(resp.body[0].offerId).toEqual(offerId);
      });

    // Rbac Case.
    const badToken = await container.get(EncodeIdentity).execute({
      uid: 'userId',
      email: 'opazke',
      providerId: null,
      provider: IdentityProvider.odb,
    });

    await request(app)
      .get(`/subscription/${subscriberId}`)
      .set('Authorization', `Bearer ${badToken}`)
      .expect(401);
  });

  it('Should get complete subscription response', async () => {
    // GIVEN
    let subscriptionId = '';
    const offerId = '0d84b88b-e93a-4de7-b52e-44eacd9e7b18';
    await request(app)
      .post('/subscription')
      .send({
        uid: subscriberId,
        offerId,
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect(response => {
        expect(response.body.offerId).toEqual(offerId);
        subscriptionId = response.body.id;
      });
    await container.get(ActivateSubscription).execute({
      subscriptionId,
    });
    await container.get(ProcessSubscription).execute({
      subscriptionId,
      cardId: 'aaa',
    });

    // WHEN
    await request(app)
      .get(`/subscription/${subscriberId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(resp => {
        // THEN
        expect(resp.body[0].offerId).toEqual(offerId);
        expect(resp.body[0].cardId).toBeTruthy();
        expect(resp.body[0].nextBillingDate).toBeTruthy();
        expect(resp.body[0].activationDate).toBeTruthy();
      });
  });
});
