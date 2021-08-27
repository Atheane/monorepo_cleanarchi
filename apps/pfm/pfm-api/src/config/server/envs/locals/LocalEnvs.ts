import { Env, Load, Local } from '@oney/envs';
import {
  IAppInsightConfiguration,
  ISmoneyConfig,
  IEventsConfig,
  ITransactionConfig,
  IAzureBlobStorageConfiguration,
  ILocalEnvs,
  IMongoDBConfiguration,
} from './ILocalEnvs';

@Local()
class AppInsightConfiguration implements IAppInsightConfiguration {
  @Env('USE_APP_INSIGHTS')
  readonly isActive: boolean;
}

@Local()
class SmoneyConfig implements ISmoneyConfig {
  @Env('ODB_ACCOUNT_MANAGEMENT_SMONEY_API_URL')
  readonly baseUrl: string;
}

@Local()
class EventsConfig implements IEventsConfig {
  @Env('SERVICE_BUS_SUBSCRIPTION')
  readonly serviceBusSubscription: string;

  @Env('SERVICE_BUS_PAYMENT_TOPIC')
  readonly paymentTopic: string;

  @Env('SERVICE_BUS_PFM_TOPIC')
  readonly pfmTopic: string;
}

@Local()
class TransactionConfig implements ITransactionConfig {
  @Env('ODB_TRANSACTION_SMONEY_API_URL')
  readonly baseUrl: string;
}

@Local()
export class AzureBlobStorageConfiguration implements IAzureBlobStorageConfiguration {
  @Env('ODB_PFM_BLOB_STORAGE_CONTAINER_NAME')
  readonly containerName: string;
}

@Local()
class MongoDBPfmConfiguration implements IMongoDBConfiguration {
  @Env('ODB_DB_PFM_NAME')
  readonly name: string;
}
// TODO remove this connexion
@Local()
class MongoDBAccountConfiguration implements IMongoDBConfiguration {
  @Env('ODB_DB_ACCOUNT_NAME')
  readonly name: string;
}

@Local()
class MongoDBTransactionConfiguration implements IMongoDBConfiguration {
  @Env('ODB_DB_TRANSACTION_NAME')
  readonly name: string;
}

@Local()
class MongoDBEventStoreConfiguration implements IMongoDBConfiguration {
  @Env('ODB_DB_EVENT_STORE_NAME')
  readonly name: string;
}
@Local()
export class LocalEnvs implements ILocalEnvs {
  @Load(AzureBlobStorageConfiguration)
  readonly azureBlobStorageConfiguration: AzureBlobStorageConfiguration;

  @Load(AppInsightConfiguration)
  readonly appInsightConfiguration: AppInsightConfiguration;

  @Load(SmoneyConfig)
  readonly smoneyConfig: SmoneyConfig;

  @Load(EventsConfig)
  readonly eventsConfig: EventsConfig;

  @Load(TransactionConfig)
  readonly transactionConfig: TransactionConfig;

  @Load(MongoDBPfmConfiguration)
  readonly mongoDBPfmConfiguration: MongoDBPfmConfiguration;

  @Load(MongoDBEventStoreConfiguration)
  readonly mongoDBEventStoreConfiguration: MongoDBEventStoreConfiguration;

  @Load(MongoDBTransactionConfiguration)
  readonly mongoDBTransactionConfiguration: MongoDBTransactionConfiguration;

  @Load(MongoDBAccountConfiguration)
  readonly mongoDBAccountConfiguration: MongoDBAccountConfiguration;

  @Env('PORT')
  readonly port: string;

  @Env('ODB_AGGREGATION_BASE_URL')
  readonly aggregationBaseUrl: string;

  @Env('BLOB_STORAGE_ENDPOINT')
  readonly blobStorageEndpoint: string;

  @Env('AzureAdTenantId')
  azureAdTenantId: string;

  @Env('FEATURE_FLAG_AGGREGATION')
  featureFlagAggregation: boolean;
}
