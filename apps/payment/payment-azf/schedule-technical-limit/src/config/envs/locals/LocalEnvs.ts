/* eslint-disable no-underscore-dangle */
import { Env, Load, Local } from '@oney/env';
import { IServiceBus, ILocalEnvs } from './ILocalEnvs';

@Local()
export class ServiceBus implements IServiceBus {
  @Env('TECHNICAL_LIMIT_FUNCTION_SUBSCRIPTION')
  subscription: string;

  @Env('ODB_PAYMENT_TOPIC')
  topic: string;
}

@Local()
export class LocalEnvs implements ILocalEnvs {
  @Load(ServiceBus)
  serviceBus: ServiceBus;

  @Env('ODB_PAYMENT_MONGO_ACCOUNT_MANAGEMENT_DATABASE')
  accountManagementDatabaseName: string;

  @Env('ODB_PAYMENT_MONGO_ACCOUNT_MANAGEMENT_COLLECTION')
  accountManagementMongoDbCollection: string;

  @Env('FRONT_DOOR_API_BASE_URL')
  frontDoorApiBaseUrl: string;
}
