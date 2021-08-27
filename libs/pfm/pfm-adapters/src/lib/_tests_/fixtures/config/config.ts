import { IAppConfiguration } from '@oney/pfm-core';

export const testConfiguration: IAppConfiguration = {
  vault: {
    cosmosDbConnectionString: 'mongodb://root:password@localhost:27017?authSource=admin',
    jwtSecret: '',
  },
  azureBlobStorageConfiguration: {
    containerName: 'documents',
    connectionString:
      'DefaultEndpointsProtocol=https;AccountName=odb0storage0dev;AccountKey=wiS0upEBf91Dxz2Q7D0TUMYu+3nG0EwN3UgVPXi5gC5LAahZZPKjlYqq/i0w04/L2saKNRZBr6FnrQdxaLIx8Q==;EndpointSuffix=core.windows.net',
  },
  mongoDBEventStoreConfiguration: {
    name: process.env.MONGO_DB_NAME,
  },
  mongoDBPfmConfiguration: {
    name: process.env.MONGO_DB_NAME,
  },
  mongoDBTransactionConfiguration: {
    name: process.env.MONGO_DB_NAME,
  },
  mongoDBAccountConfiguration: {
    name: process.env.MONGO_DB_NAME,
  },
  appInsightConfiguration: {
    apiKey: '79048db8-61cc-4258-8844-b000afb505ea',
    isActive: false,
  },
  smoneyConfig: {
    baseUrl: 'https://rest-pp.s-money.fr/api/bib/sandbox/api/',
    token: 'MTM7MTg7NVVjUUk2UTFONw==',
  },
  eventsConfig: {
    paymentTopic: 'odb_payment_topic',
    pfmTopic: 'odb_pfm_topic',
    serviceBusSubscription: 'odb_sub_pfm',
    serviceBusUrl:
      'Endpoint=sb://odb-bus-dev.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=Hwricl9f9o24h7gKmjMHiNTOblygbauoppxlKM1oiDY=',
  },
  transactionConfig: {
    baseUrl: 'https://odb-api-management-dev.azure-api.net/transactions',
  },
  port: '3003',
  odbFrontDoorUrl: 'https://dev-api.onbadi.com',
  aggregationBaseUrl: 'https://dev-api.onbadi.com/aggregation',
  blobStorageEndpoint: 'https://fake-test-storage.onbadi.com',
  azureAdTenantId: '1cbcfc5b-bfc4-46cf-9dd1-b61140309b99',
  featureFlagAggregation: true,
};
