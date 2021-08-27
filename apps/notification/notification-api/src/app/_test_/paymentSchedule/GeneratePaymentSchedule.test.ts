import 'reflect-metadata';
import { describe, beforeAll, it, expect, jest } from '@jest/globals';
import { ConfigService } from '@oney/env';
import * as path from 'path';
import { Configuration } from '../../config/config.env';
import { getKernelDependencies } from '../../di/config.kernel';
import { DataSendType } from '../../domain/types/DataSendType';
import { configureEventDispatcher } from '../../services/server';
import {
  splitPaymentScheduleCreatedProperties,
  content,
  footer,
  pdfOptions,
} from '../fixtures/generatePaymentSchedule';

describe('GeneratePaymentSchedule use case test', () => {
  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/../env/test.env');
    await new ConfigService({ localUri: envPath }).loadEnv();
    const config = new Configuration();
    // Logger.setup(config.loggerLevel, config.appInfo);
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

  it('should dispatch push notification when GeneratePaymentSchedule use case is executed', async () => {
    const { generatePaymentSchedule } = getKernelDependencies();

    const result: DataSendType = await generatePaymentSchedule.execute(splitPaymentScheduleCreatedProperties);

    expect(result).toEqual({
      path: `${splitPaymentScheduleCreatedProperties.userId}/payment schedule/${splitPaymentScheduleCreatedProperties.bankAccountId}/${splitPaymentScheduleCreatedProperties.contractNumber}.pdf`,
      content: content,
      footer: footer,
      pdfOptions: pdfOptions,
    });
  });
});
