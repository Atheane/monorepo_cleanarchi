// eslint-disable-next-line max-classes-per-file
import { Env, KeyVault, Local } from '@oney/envs';

const isProduction = process.env.NODE_ENV === 'production';

//fixme export the db configuration as profile api.
@KeyVault(isProduction)
export class KeyVaultConfiguration {
  @Env('AccountDbProvider')
  mongoPath: string;

  @Env('EventStoreDbProvider')
  mongoUrlEventStore: string;

  @Env('ServiceBusConnectionString')
  serviceBusUrl: string;
}

@Local()
export class EnvConfiguration {
  @Env('DB_COLLECTION')
  mongoDbCollection: string;

  @Env('EVENT_STORE_DB_COLLECTION')
  mongoCollectionEventStore: string;

  @Env('KYC_DECISION_FUNCTION_SERVICE_BUS_SUBSCRIPTION')
  serviceBusSub: string;

  @Env('KYC_DECISION_FUNCTION_SERVICE_BUS_TOPIC')
  serviceBusTopic: string;
}

export const envConfiguration = EnvConfiguration.prototype;
export const keyVaultConfiguration = KeyVaultConfiguration.prototype;
