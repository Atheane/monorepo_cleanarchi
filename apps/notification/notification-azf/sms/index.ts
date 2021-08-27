import { AzureFunction, Context } from '@azure/functions';
import { INTERNAL_SERVER_ERROR } from 'http-status';

const smsNotificationHandler: AzureFunction = async function (context: Context, message: any): Promise<void> {
  context.log(`received sms notification`, message);
  try {
    const sms = {
      body: message.content,
      to: message.recipient,
    };

    context.log(`sending sms notification to TWILIO`, sms);
    context.done(null, sms);
  } catch (error) {
    context.log('Error happened while processing the sms notification:', error);
    context.res = {
      status: INTERNAL_SERVER_ERROR,
      error: error.message,
    };
  }
};

export default smsNotificationHandler;
