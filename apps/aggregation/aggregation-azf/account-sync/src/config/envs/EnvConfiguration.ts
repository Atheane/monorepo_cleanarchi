import { IAzfConfiguration, IAppInsight, IBudgetInsight, IServiceBus } from './IAzfConfiguration';
import { ILocalEnvs } from './locals/ILocalEnvs';
import { LocalEnvs } from './locals/LocalEnvs';
import { ISecretEnvs } from './secrets/ISecretEnvs';
import { SecretEnvs } from './secrets/SecretEnvs';

export class AppConfiguration implements IAzfConfiguration {
  readonly appInsightConfiguration: IAppInsight;
  readonly budgetInsightConfiguration: IBudgetInsight;
  readonly serviceBusConfiguration: IServiceBus;
  readonly cosmosDbConnectionString: string;

  constructor(localEnvs: ILocalEnvs, secretEnvs: ISecretEnvs) {
    this.appInsightConfiguration = {
      isActive: localEnvs.appInsight.isActive,
      trackConsoleLogs: localEnvs.appInsight.trackConsoleLogs,
      trackBodies: localEnvs.appInsight.trackConsoleLogs,
      appInsightKey: secretEnvs.appInsightKey,
      appInsightInstrumentKey: secretEnvs.appInsightInstrumentKey,
    };
    this.budgetInsightConfiguration = {
      baseUrl: localEnvs.budgetInsight.baseUrl,
      clientId: localEnvs.budgetInsight.clientId,
      clientSecret: secretEnvs.budgetInsightClientSecret,
      tokenUrl: secretEnvs.tokenUrl,
    };
    this.serviceBusConfiguration = {
      connectionString: secretEnvs.serviceBusConnectionString,
      subscription: localEnvs.serviceBus.subscription,
      topic: localEnvs.serviceBus.topic,
    };
    this.cosmosDbConnectionString = secretEnvs.cosmosDbConnectionString;
  }
}

export function getAppConfiguration(): IAzfConfiguration {
  const localEnvs = new LocalEnvs();
  const secretEnvs = new SecretEnvs();
  return new AppConfiguration(localEnvs, secretEnvs);
}
