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
  eventHubConfiguration: {
    connectionString:
      'Endpoint=sb://fake.servicebus.windows.net/;SharedAccessKeyName=listen;SharedAccessKey=CCQGw/KZ0qk3c/0Rr3y3W2NUMNdiWqszx91fylljicc=;EntityPath=elig-ficp-fcc',
    name: 'fake',
  },
};
