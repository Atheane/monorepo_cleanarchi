export interface IServiceBus {
  subscription: string;
  topic: string;
}

export interface ILocalEnvs {
  serviceBus: IServiceBus;
  accountManagementMongoDbCollection: string;
  accountManagementDatabaseName: string;
  frontDoorApiBaseUrl: string;
}
