import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import { ConfigService } from '@oney/env';
import { Events } from '@oney/notification-messages';
import * as path from 'path';
import 'reflect-metadata';
import { RefreshClient, RefreshClientCommand, RefreshClientCommandResult } from '../../usecase/RefreshClient';
import { userCredentials } from '../fixtures/UserCredentials';

beforeAll(async () => {
  const envPath = path.resolve(__dirname + '/../env/test.env');
  await new ConfigService({ localUri: envPath }).loadEnv();
  // const config = new Configuration();
  // Logger.setup(config.loggerLevel, config.appInfo);

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

describe('Refresh client use case test', () => {
  it('should dispatch push notification when RefreshClient use case is executed', async () => {
    const refreshClient = new RefreshClient();
    const refreshClientCommand: RefreshClientCommand = {
      userId: userCredentials.uid,
      eventName: Events.CARD_TRANSACTION_RECEIVED,
      eventDate: new Date(),
    };

    const sentRefreshClientRequest = await refreshClient.execute(refreshClientCommand);

    const expected: RefreshClientCommandResult = {
      userIds: [refreshClientCommand.userId],
      notification: {
        data: {
          eventName: refreshClientCommand.eventName,
          eventDate: refreshClientCommand.eventDate,
        },
      },
      isSilent: true,
    };

    expect(sentRefreshClientRequest).toEqual(expected);
  });
});
