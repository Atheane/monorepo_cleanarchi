import { IAppConfiguration } from '../../../src/di/app';

export const testConfiguration: IAppConfiguration = {
  mongoURI: 'mongodb://root:password@mongo:27017/credit_test?authSource=admin',
  odbPaymentAuthKey: 'bWFsYWlrYTpzdXBlcnNlY3JldA==',
  odbPaymentBaseUrl: 'https://dev-api.onbadi.com/payment',
  odbPaymentRetryDelay: 500,
  odbPaymentMaxRetries: 3,
  serviceBusConfiguration: {
    connectionString:
      'Endpoint=sb://odb-bus-fake.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=Hwricl9f9o24h=',
    topic: 'fake_topic',
    subscription: 'fake_subscription',
  },
};
