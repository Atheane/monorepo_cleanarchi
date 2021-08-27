import {
  IAppConfiguration,
  IAppInsightConfiguration,
  IBudgetInsightConfiguration,
  IMongoDBConfiguration,
  IAlgoanConfiguration,
  IServiceBus,
  IBlobStorageConfiguration,
  IPP2ReveConfiguration,
} from '@oney/aggregation-core';
import { ILocalEnvs } from './locals/ILocalEnvs';
import { LocalEnvs } from './locals/LocalEnvs';
import { ISecretEnvs } from './secrets/ISecretEnvs';
import { SecretEnvs } from './secrets/SecretEnvs';

class AppConfiguration implements IAppConfiguration {
  readonly appInsightConfiguration: IAppInsightConfiguration;
  readonly budgetInsightConfiguration: IBudgetInsightConfiguration;
  readonly mongoDBConfiguration: IMongoDBConfiguration;
  readonly algoanConfig: IAlgoanConfiguration;
  readonly webHookToken: string;
  readonly jwtSecret: string;
  readonly serviceBus: IServiceBus;
  readonly blobStorageEndpoint: string;
  readonly odbApiFrontDoor: string;
  readonly blobStorageConfiguration: IBlobStorageConfiguration;
  readonly port: number;
  readonly azureTenantId: string;
  readonly pp2reveConfiguration: IPP2ReveConfiguration;

  constructor(localEnvs: ILocalEnvs, secretEnvs: ISecretEnvs) {
    this.appInsightConfiguration = {
      isActive: localEnvs.appInsightConfiguration.isActive,
      trackConsoleLogs: localEnvs.appInsightConfiguration.trackConsoleLogs,
      trackBodies: localEnvs.appInsightConfiguration.trackBodies,
      apiKey: secretEnvs.apiKey,
    };
    this.budgetInsightConfiguration = {
      testConnectorId: localEnvs.budgetInsightConfiguration.testConnectorId,
      baseUrl: localEnvs.budgetInsightConfiguration.baseUrl,
      clientId: localEnvs.budgetInsightConfiguration.clientId,
      clientSecret: secretEnvs.clientSecret,
      longPolling: {
        maxAttemps: localEnvs.budgetInsightConfiguration.longPolling.maxAttemps,
        interval: localEnvs.budgetInsightConfiguration.longPolling.interval,
      },
    };
    this.mongoDBConfiguration = {
      uri: secretEnvs.path,
    };
    this.algoanConfig = {
      baseUrl: localEnvs.algoanConfig.baseUrl,
      clientId: localEnvs.algoanConfig.clientId,
      longPolling: {
        maxAttemps: localEnvs.algoanConfig.longPolling.maxAttemps,
        interval: localEnvs.algoanConfig.longPolling.interval,
      },
      clientSecret: secretEnvs.algoanClientSecret,
      restHookId: secretEnvs.algoanResthookId,
    };
    this.webHookToken = secretEnvs.webHookToken;
    this.jwtSecret = secretEnvs.jwtSecret;
    this.serviceBus = {
      connectionString: secretEnvs.serviceBusConnectionString,
      subscription: localEnvs.serviceBus.subscription,
      aggregationTopic: localEnvs.serviceBus.aggregationTopic,
      authenticationTopic: localEnvs.serviceBus.authenticationTopic,
      paymentTopic: localEnvs.serviceBus.paymentTopic,
    };
    this.port = localEnvs.port;
    this.odbApiFrontDoor = localEnvs.odbApiFrontDoor;
    this.blobStorageConfiguration = {
      connectionString: secretEnvs.blobStorageConnectionString,
      containerName: localEnvs.blobStorageConfiguration.containerName,
      endpoint: localEnvs.blobStorageConfiguration.endpoint,
      termsVersion: localEnvs.blobStorageConfiguration.termsVersion,
    };
    this.azureTenantId = secretEnvs.azureTenantId;
    this.pp2reveConfiguration = {
      retryDelay: localEnvs.pp2reveConfiguration.retryDelay,
      maxRetries: localEnvs.pp2reveConfiguration.maxRetries,
    };
  }
}

export function getAppConfiguration(): IAppConfiguration {
  const localEnvs = new LocalEnvs();
  const secretEnvs = new SecretEnvs();
  return new AppConfiguration(localEnvs, secretEnvs);
}
