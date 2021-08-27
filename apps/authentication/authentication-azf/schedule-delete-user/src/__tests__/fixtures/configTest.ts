import { IAzfConfiguration } from '../../config/envs';

export const testConfiguration: IAzfConfiguration = {
  appInsightConfiguration: {
    isActive: false,
    trackBodies: false,
    trackConsoleLogs: false,
    appInsightInstrumentKey: 'fake-key',
  },
  serviceBusConfiguration: {
    connectionString:
      'Endpoint=sb://odb-bus-fake.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=Hwricl9f9o24h=',
    topic: 'fake_topic',
    subscription: 'fake_subscription',
  },
  cosmosDbConfiguration: {
    cosmosDbConnectionString:
      'mongodb://odb-data-fake@odb-data-dev.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@odb-data-dev@',
    dbName: 'odb_authentication',
  },
};
