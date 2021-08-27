import { Context } from '@azure/functions';
import { INTERNAL_SERVER_ERROR } from 'http-status';
import smsNotificationHandler from '../index';

describe('Test sms notification handler', () => {
  it('should send sms notification to twilio', async () => {
    let resultSms = {};
    const context = {
      bindings: {},
      log: () => undefined,
      done: (_, sms) => {
        resultSms = sms;
      },
    } as Context;

    const message = {
      content: 'test sms content',
      recipient: 'user-1',
    };
    await smsNotificationHandler(context, message);

    expect(resultSms).toEqual({
      body: message.content,
      to: message.recipient,
    });
  });

  it('should catch exception', async () => {
    const context = {
      log: () => undefined,
    } as Context;

    await smsNotificationHandler(context, null);

    expect(context.res.status).toEqual(INTERNAL_SERVER_ERROR);
  });
});
