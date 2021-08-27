import 'reflect-metadata';
import './mocks/azureBus.mock';
import * as express from 'express';
import { Container } from 'inversify';
import { EnrollSubscriber, GetSubscriberById } from '@oney/subscription-core';
import { ProfileStatus, ProfileActivated, ProfileActivationType } from '@oney/profile-messages';
import { v4 } from 'uuid';
import * as path from 'path';
import { bootstrap } from '../config/bootstrap';
import { ProfileActivatedHandler } from '../../modules/subscribers/handlers/ProfileActivatedHandler';

const app = express();

describe('INTEGRATION - ProfileActivatedHandler', () => {
  let container: Container;
  let subscriberId: string;
  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/../env/test.env');
    container = await bootstrap(app, envPath, process.env.MONGO_URL);
  });

  beforeEach(async () => {
    subscriberId = v4() + new Date().getTime().toString();
    await container.get(EnrollSubscriber).execute({
      uid: subscriberId,
    });
  });

  it('Should activate a subscriber', async () => {
    // GIVEN
    const activateSubscriberHandler = container.resolve(ProfileActivatedHandler);
    const profileActivated = new ProfileActivated({
      profileStatus: ProfileStatus.ACTIVE,
      activationType: ProfileActivationType.TRANSFER,
    });
    profileActivated.metadata = {
      aggregateId: subscriberId,
      aggregate: ProfileActivated.name,
    };

    // WHEN
    const result = activateSubscriberHandler.handle(profileActivated);

    // THEN
    await expect(result).resolves.not.toThrow();
    const getSubscriberById = await container.get(GetSubscriberById).execute({
      uid: subscriberId,
    });
    expect(getSubscriberById.props.activatedAt).toBeTruthy();
  });

  it('Should not activate a subscriber', async () => {
    // GIVEN
    const activateSubscriberHandler = container.resolve(ProfileActivatedHandler);
    const profileActivated = new ProfileActivated({
      profileStatus: ProfileStatus.ON_BOARDING,
      activationType: ProfileActivationType.TRANSFER,
    });
    profileActivated.metadata = {
      aggregateId: subscriberId,
      aggregate: ProfileActivated.name,
    };

    // WHEN
    const result = activateSubscriberHandler.handle(profileActivated);
    await expect(result).resolves.not.toThrow();

    // THEN
    const getSubscriberById = await container.get(GetSubscriberById).execute({
      uid: subscriberId,
    });
    expect(getSubscriberById.props.activatedAt).toBeFalsy();
  });
});
