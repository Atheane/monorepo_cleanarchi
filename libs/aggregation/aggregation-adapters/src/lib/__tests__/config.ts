import { IAppConfiguration } from '@oney/aggregation-core';

export const testConfiguration: IAppConfiguration = {
  appInsightConfiguration: {
    apiKey: '79048db8-61cc-4258-8844-b000afb505ea',
    isActive: false,
    trackBodies: true,
    trackConsoleLogs: true,
  },
  algoanConfig: {
    baseUrl: 'https://api.preprod.algoan.com/v1',
    clientId: 'oney-score-1',
    longPolling: { interval: 5000, maxAttemps: 3 },
    clientSecret: '42cbb0bd-dbf1-49a7-88e9-6524c195be6c',
    restHookId: 'test',
  },
  budgetInsightConfiguration: {
    baseUrl: 'https://oney-dev-sandbox.biapi.pro/2.0',
    clientId: '11571068',
    testConnectorId: '59',
    clientSecret: 'NND6d9s2uAmLixdSVUaw6ilXNKXp0i4t',
    longPolling: { interval: 5000, maxAttemps: 3 }, // if you need to renew fixtures with transactions => interval : 1000, maxAttemps : 10
  },
  mongoDBConfiguration: {
    uri: 'mongodb://root:password@mongo:27017/aggregation_test?authSource=admin',
  },
  webHookToken: 'bGF2aWVlc3RiZWxsZWVweWNldG91',
  jwtSecret: 'weshpoto',
  serviceBus: {
    connectionString: 'azdazdza',
    subscription: 'aze',
    aggregationTopic: 'qdsqs',
    authenticationTopic: 'azkheiauoz',
    paymentTopic: 'kazeoiauze',
  },
  blobStorageConfiguration: {
    connectionString:
      'DefaultEndpointsProtocol=https;AccountName=odb0storage0dev;AccountKey=wiS0upEBf91Dxz2Q7D0TUMYu+3nG0EwN3UgVPXi5gC5LAahZZPKjlYqq/i0w04/L2saKNRZBr6FnrQdxaLIx8Q==;EndpointSuffix=core.windows.net',
    containerName: 'documents',
    endpoint: 'https://fake-test-storage.onbadi.com',
    termsVersion: '20210323_3',
  },
  pp2reveConfiguration: {
    maxRetries: 3,
    retryDelay: 500,
  },
  port: 3003,
  odbApiFrontDoor: 'https://dev-api.onbadi.com',
  azureTenantId: '1cbcfc5b-bfc4-46cf-9dd1-b61140309b99',
};
