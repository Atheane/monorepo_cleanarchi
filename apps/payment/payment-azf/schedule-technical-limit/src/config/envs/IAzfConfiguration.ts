export interface IServiceBus {
  connectionString: string;
  subscription: string;
  topic: string;
}

export interface ICosmosDb {
  mongoPath: string;
  accountManagementDatabaseName: string;
  accountManagementCollection: string;
}

export interface ISmoneyConf {
  smoneyBic: string;
  getTokenUrl: string;
  clientId: string;
  clientSecret: string;
  grantType: string;
  scope: string;
  baseUrl: string;
  legacyToken: string;
}

export class IAzfConfiguration {
  serviceBusConfiguration: IServiceBus;
  cosmosDbConfiguration: ICosmosDb;
  smoneyConf: ISmoneyConf;
  frontDoorApiBaseUrl: string;
  jwtSecret: string;
}
