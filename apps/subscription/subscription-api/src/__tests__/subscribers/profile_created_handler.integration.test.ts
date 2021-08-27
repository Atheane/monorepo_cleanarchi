import 'reflect-metadata';
import './mocks/azureBus.mock';
import * as express from 'express';
import { Container } from 'inversify';
import { GetSubscriberById } from '@oney/subscription-core';
import { ProfileCreated } from '@oney/profile-messages';
import { CustomerType } from '@oney/subscription-messages';
import { v4 } from 'uuid';
import * as path from 'path';
import { bootstrap } from '../config/bootstrap';
import { ProfileCreatedHandler } from '../../modules/subscribers/handlers/ProfileCreatedHandler';

const app = express();

describe('INTEGRATION - ProfileCreatedHandler', () => {
  let container: Container;
  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/../env/test.env');
    container = await bootstrap(app, envPath, process.env.MONGO_URL);
  });

  it('Should Create Subscriber', async () => {
    const subscriberId = v4() + new Date().getTime().toString();
    const createSubscriberHandler = container.resolve(ProfileCreatedHandler);
    const profileCreated = new ProfileCreated({
      uid: subscriberId,
      status: null,
      steps: [],
      phone: null,
      digitalIdentityId: null,
      email: null,
    });
    profileCreated.metadata = {
      aggregateId: subscriberId,
      aggregate: 'Profile',
    };
    const handle = createSubscriberHandler.handle(profileCreated);
    await expect(handle).resolves.not.toThrow();
    const result = await container.get(GetSubscriberById).execute({
      uid: subscriberId,
    });
    expect(result.props.customerType).toEqual(CustomerType.DEFAULT);
    expect(result.props.uid).toEqual(subscriberId);
  });
});
