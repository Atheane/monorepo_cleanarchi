import { IAzfConfiguration, IServiceBus, ICosmosDb, ISmoneyConf } from './IAzfConfiguration';
import { ILocalEnvs } from './locals/ILocalEnvs';
import { LocalEnvs } from './locals/LocalEnvs';
import { ISecretEnvs } from './secrets/ISecretEnvs';
import { SecretEnvs } from './secrets/SecretEnvs';

export class AppConfiguration implements IAzfConfiguration {
  readonly serviceBusConfiguration: IServiceBus;
  readonly cosmosDbConfiguration: ICosmosDb;
  readonly smoneyConf: ISmoneyConf;
  readonly frontDoorApiBaseUrl: string;
  readonly jwtSecret: string;

  constructor(localEnvs: ILocalEnvs, secretEnvs: ISecretEnvs) {
    this.serviceBusConfiguration = {
      connectionString: secretEnvs.serviceBusConnectionString,
      subscription: localEnvs.serviceBus.subscription,
      topic: localEnvs.serviceBus.topic,
    };
    this.cosmosDbConfiguration = {
      accountManagementCollection: localEnvs.accountManagementMongoDbCollection,
      accountManagementDatabaseName: localEnvs.accountManagementDatabaseName,
      mongoPath: secretEnvs.cosmosDbConnectionString,
    };
    this.smoneyConf = {
      smoneyBic: secretEnvs.smoneyBic,
      getTokenUrl: secretEnvs.getTokenUrl,
      clientId: secretEnvs.clientId,
      clientSecret: secretEnvs.clientSecret,
      grantType: secretEnvs.grantType,
      scope: secretEnvs.scope,
      baseUrl: secretEnvs.baseUrl,
      legacyToken: secretEnvs.legacyToken,
    };
    this.frontDoorApiBaseUrl = localEnvs.frontDoorApiBaseUrl;
    this.jwtSecret = secretEnvs.jwtSecret;
  }
}

export function getAppConfiguration(): IAzfConfiguration {
  const localEnvs = new LocalEnvs();
  const secretEnvs = new SecretEnvs();
  return new AppConfiguration(localEnvs, secretEnvs);
}
