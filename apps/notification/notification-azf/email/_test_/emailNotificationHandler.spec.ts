import { Context } from '@azure/functions';
import { INTERNAL_SERVER_ERROR } from 'http-status';
import { envConfiguration } from '../config/EnvConfig';
import emailNotificationHandler from '../index';

describe('Test email notification handler', () => {
  it('should send email notification to sendGrid', async () => {
    let resultEmail = {};
    const context = {
      log: () => undefined,
      done: (_, email) => {
        resultEmail = email;
      },
    } as Context;
    const message = {
      recipient: 'client-1',
      from: 'oney',
      subject: 'virement',
      content: 'this is a test email',
    };

    await emailNotificationHandler(context, message);

    expect(resultEmail).toEqual({
      personalizations: [{ to: [{ email: 'client-1' }] }],
      from: { email: 'oney' },
      subject: 'virement',
      content: [
        {
          type: 'text/html',
          value: 'this is a test email',
        },
      ],
    });
  });

  it('should send email notification to sendGrid with default sender email when sender is not present in message', async () => {
    let resultEmail = {};
    const context = {
      log: () => undefined,
      done: (_, email) => {
        resultEmail = email;
      },
    } as Context;
    const message = { recipient: 'client-1', subject: 'virement', content: 'this is a test email' };

    await emailNotificationHandler(context, message);

    expect(resultEmail).toEqual({
      personalizations: [{ to: [{ email: 'client-1' }] }],
      from: { email: envConfiguration.fromEmailAddress },
      subject: 'virement',
      content: [
        {
          type: 'text/html',
          value: 'this is a test email',
        },
      ],
    });
  });

  it('should catch exception', async () => {
    const context = {
      log: () => undefined,
    } as Context;

    await emailNotificationHandler(context, null);

    expect(context.res.status).toEqual(INTERNAL_SERVER_ERROR);
  });
});
