import { ConfigService } from '@oney/env';
import * as path from 'path';
import 'reflect-metadata';
import { Configuration } from '../../config/config.env';
import { RecipientModel } from '../../database/schemas/recipient';
import { getKernelDependencies } from '../../di/config.kernel';
import { configureDatabase, configureEventDispatcher } from '../../services/server';
import {
  expectedRecipientRegistered,
  registerRecipientCommandMocked,
} from '../fixtures/registerRecipient.fixture';

describe('RegisterRecipient use case', () => {
  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/../env/test.env');
    await new ConfigService({ localUri: envPath }).loadEnv();
    const config = new Configuration();
    // Logger.setup(config.loggerLevel, config.appInfo);
    await configureEventDispatcher(config.serviceBusConfiguration, true);
    await configureDatabase({ uri: process.env.MONGO_URL });
  });

  beforeEach(async () => {
    await RecipientModel.deleteMany({});
  });

  it('should register a new recipient stored in database', async () => {
    const { registerRecipient } = getKernelDependencies();

    const recipientCreated = await registerRecipient.execute(registerRecipientCommandMocked);

    expect(recipientCreated.props).toEqual(expectedRecipientRegistered);
  });
});
