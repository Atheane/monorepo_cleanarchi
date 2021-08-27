import { IAzfConfiguration, IAppInsight, IServiceBus, IEventHubConfiguration } from './IAzfConfiguration';
import { ILocalEnvs } from './locals/ILocalEnvs';
import { LocalEnvs } from './locals/LocalEnvs';
import { ISecretEnvs } from './secrets/ISecretEnvs';
import { SecretEnvs } from './secrets/SecretEnvs';

export class AppConfiguration implements IAzfConfiguration {
  readonly appInsightConfiguration: IAppInsight;
  readonly serviceBusConfiguration: IServiceBus;
  readonly eventHubConfiguration: IEventHubConfiguration;

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
    this.eventHubConfiguration = {
      connectionString: secretEnvs.eventHubConnectionString,
      name: localEnvs.eventHubName,
    };
  }
}

export function getAppConfiguration(): IAzfConfiguration {
  const localEnvs = new LocalEnvs();
  const secretEnvs = new SecretEnvs();
  return new AppConfiguration(localEnvs, secretEnvs);
}
