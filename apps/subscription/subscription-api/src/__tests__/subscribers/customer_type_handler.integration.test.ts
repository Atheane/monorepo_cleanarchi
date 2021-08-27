import 'reflect-metadata';
import './mocks/azureBus.mock';
import * as express from 'express';
import { Container } from 'inversify';
import { EnrollSubscriber, GetSubscriberById } from '@oney/subscription-core';
import { SituationAttached } from '@oney/profile-messages';
import { CustomerType } from '@oney/subscription-messages';
import { v4 } from 'uuid';
import * as path from 'path';
import { bootstrap } from '../config/bootstrap';
import { CustomerTypeHandler } from '../../modules/subscribers/handlers/CustomerTypeHandler';

const app = express();

describe('INTEGRATION - CustomerTypeHandler', () => {
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

  it('Should update to VIP CustomerType', async () => {
    // GIVEN
    const customerTypeHandler = container.resolve(CustomerTypeHandler);
    const situationAttached = new SituationAttached({
      lead: false,
      staff: false,
      vip: true,
      consents: {
        oney: {
          cnil: false,
          len: null,
        },
        partners: {
          cnil: false,
          len: null,
        },
      },
    });
    situationAttached.metadata = {
      aggregateId: subscriberId,
      aggregate: 'Profile',
    };

    // WHEN
    const handleVip = customerTypeHandler.handle(situationAttached);

    await expect(handleVip).resolves.not.toThrow();

    // THEN
    const result = await container.get(GetSubscriberById).execute({
      uid: subscriberId,
    });
    expect(result.props.customerType).toEqual(CustomerType.VIP);
  });

  it('Should update to Staff CustomerType', async () => {
    // GIVEN
    const customerTypeHandler = container.resolve(CustomerTypeHandler);
    const situationAttached = new SituationAttached({
      lead: false,
      staff: true,
      vip: false,
      consents: {
        oney: {
          cnil: false,
          len: null,
        },
        partners: {
          cnil: false,
          len: null,
        },
      },
    });
    situationAttached.metadata = {
      aggregateId: subscriberId,
      aggregate: 'Profile',
    };

    // WHEN
    const handleVip = customerTypeHandler.handle(situationAttached);

    // THEN
    await expect(handleVip).resolves.not.toThrow();
    const result = await container.get(GetSubscriberById).execute({
      uid: subscriberId,
    });
    expect(result.props.customerType).toEqual(CustomerType.COLLABORATOR);
  });

  it('Should update to Lead CustomerType', async () => {
    // GIVEN
    const customerTypeHandler = container.resolve(CustomerTypeHandler);
    const situationAttached = new SituationAttached({
      lead: true,
      staff: false,
      vip: false,
      consents: {
        oney: {
          cnil: false,
          len: null,
        },
        partners: {
          cnil: false,
          len: null,
        },
      },
    });
    situationAttached.metadata = {
      aggregateId: subscriberId,
      aggregate: 'Profile',
    };

    // WHEN
    const handleVip = customerTypeHandler.handle(situationAttached);

    // THEN
    await expect(handleVip).resolves.not.toThrow();
    const result = await container.get(GetSubscriberById).execute({
      uid: subscriberId,
    });
    expect(result.props.customerType).toEqual(CustomerType.LEAD);
  });

  it('Should update to Default CustomerType', async () => {
    // GIVEN
    const customerTypeHandler = container.resolve(CustomerTypeHandler);
    const situationAttached = new SituationAttached({
      lead: false,
      staff: false,
      vip: false,
      consents: {
        oney: {
          cnil: false,
          len: null,
        },
        partners: {
          cnil: false,
          len: null,
        },
      },
    });
    situationAttached.metadata = {
      aggregateId: subscriberId,
      aggregate: 'Profile',
    };

    // WHEN
    const handleVip = customerTypeHandler.handle(situationAttached);

    // THEN
    await expect(handleVip).resolves.not.toThrow();
    const result = await container.get(GetSubscriberById).execute({
      uid: subscriberId,
    });
    expect(result.props.customerType).toEqual(CustomerType.DEFAULT);
  });
});
