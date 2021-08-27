import 'reflect-metadata';
import { ConfigService } from '@oney/env';
import * as path from 'path';
import { Configuration } from '../../config/config.env';
import { RecipientModel } from '../../database/schemas/recipient';
import { getKernelDependencies } from '../../di/config.kernel';
import { RecipientError } from '../../domain/models/DomainError';
import { DataSendType } from '../../domain/types/DataSendType';
import { configureDatabase, configureEventDispatcher } from '../../services/server';
import {
  content,
  gerateBankAccountBisCommandMocked,
  recipientToSaveInDbMocked,
} from '../fixtures/generateBankAccountBisDocument';

describe('GenerateBankAccountBisDocument use case', () => {
  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/../env/test.env');
    await new ConfigService({ localUri: envPath }).loadEnv();
    const config = new Configuration();
    // Logger.setup(config.loggerLevel, config.appInfo);
    await configureDatabase({ uri: process.env.MONGO_URL });
    await configureEventDispatcher(config.serviceBusConfiguration, true);
    jest.mock('@azure/service-bus', () => {
      return {
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
      };
    });
  });

  beforeEach(async () => {
    await RecipientModel.deleteMany({});
  });

  it('should dispatch html builded payload to generate recipient/user bis document', async () => {
    await RecipientModel.create(recipientToSaveInDbMocked);
    const { generateBankAccountBisDocument } = getKernelDependencies();

    const result: DataSendType = await generateBankAccountBisDocument.execute(
      gerateBankAccountBisCommandMocked,
    );

    expect(result).toEqual({
      path: `bis/${gerateBankAccountBisCommandMocked.uid}/${gerateBankAccountBisCommandMocked.bid}.pdf`,
      content: content,
    });
  });

  it('should throw error: RecipientNotFound when recipient user is not found', async () => {
    const { generateBankAccountBisDocument } = getKernelDependencies();

    const result = generateBankAccountBisDocument.execute(gerateBankAccountBisCommandMocked);

    await expect(result).rejects.toThrow(RecipientError.RecipientNotFound);
  });
});
