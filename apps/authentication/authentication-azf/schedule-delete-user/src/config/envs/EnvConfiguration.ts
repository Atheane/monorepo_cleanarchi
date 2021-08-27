import { IAzfConfiguration, IAppInsight, IServiceBus, ICosmosDb } from './IAzfConfiguration';
import { ILocalEnvs } from './locals/ILocalEnvs';
import { LocalEnvs } from './locals/LocalEnvs';
import { ISecretEnvs } from './secrets/ISecretEnvs';
import { SecretEnvs } from './secrets/SecretEnvs';

export class AppConfiguration implements IAzfConfiguration {
  readonly appInsightConfiguration: IAppInsight;
  readonly serviceBusConfiguration: IServiceBus;
  readonly cosmosDbConfiguration: ICosmosDb;

  constructor(localEnvs: ILocalEnvs, secretEnvs: ISecretEnvs) {
    this.appInsightConfiguration = {
      isActive: localEnvs.appInsight.isActive,
      trackConsoleLogs: localEnvs.appInsight.trackConsoleLogs,
      trackBodies: localEnvs.appInsight.trackConsoleLogs,
      appInsightInstrumentKey: secretEnvs.appInsightInstrumentKey,
    };
    this.serviceBusConfiguration = {
      connectionString: secretEnvs.serviceBusConnectionString,
      subscription: localEnvs.serviceBus.subscription,
      topic: localEnvs.serviceBus.topic,
    };
    this.cosmosDbConfiguration = {
      dbName: localEnvs.dbName,
      cosmosDbConnectionString: secretEnvs.cosmosDbConnectionString,
    };
  }
}

export function getAppConfiguration(): IAzfConfiguration {
  const localEnvs = new LocalEnvs();
  const secretEnvs = new SecretEnvs();
  return new AppConfiguration(localEnvs, secretEnvs);
}
