import {
  IAppConfiguration,
  ISmoneyConfig,
  IMongoConfiguration,
  IVault,
  IEventsConfig,
  IMongoConnectionConfiguration,
} from '@oney/pfm-core';
import { LocalEnvs } from './locals/LocalEnvs';
import { SecretEnvs } from './secrets/SecretEnvs';
import { ILocalEnvs } from './locals/ILocalEnvs';
import { ISecretEnvs } from './secrets/ISecretEnvs';

export class AppConfiguration implements IAppConfiguration {
  readonly vault: IVault;
  readonly mongoDBPfmConfiguration: IMongoConfiguration;
  readonly mongoDBAccountConfiguration: IMongoConfiguration;
  readonly mongoDBTransactionConfiguration: IMongoConfiguration;
  readonly mongoDBEventStoreConfiguration: IMongoConfiguration;
  readonly mongoDbConnectionConfiguration: IMongoConnectionConfiguration;
  readonly smoneyConfig: ISmoneyConfig;
  readonly eventsConfig: IEventsConfig;
  readonly odbFrontDoorUrl: string;

  constructor(localEnvs: ILocalEnvs, secretEnvs: ISecretEnvs) {
    this.vault = {
      jwtSecret: secretEnvs.jwtSignatureKey,
    };
    this.mongoDbConnectionConfiguration = {
      connectionString: secretEnvs.cosmosDbConnectionString,
      poolSize: localEnvs.dbConnectionPoolSize,
      maxPoolSize: localEnvs.dbConnectionMaxPoolSize,
    };
    this.mongoDBPfmConfiguration = {
      name: localEnvs.odbDBPfmName,
    };
    this.mongoDBAccountConfiguration = {
      name: localEnvs.odbDBAccountName,
    };
    // TO-DO remove this config
    this.mongoDBTransactionConfiguration = {
      name: localEnvs.odbDBTransactionName,
    };
    // TO-DO remove this config
    this.mongoDBEventStoreConfiguration = {
      name: localEnvs.odbDBEventStoreName,
    };
    this.smoneyConfig = {
      baseUrl: localEnvs.sMoneyApiUrl,
      token: secretEnvs.sMoneyToken,
    };
    this.eventsConfig = {
      generatedStatementTopic: localEnvs.odbGeneratedStatementTopic,
      generateStatementTopic: localEnvs.generateStatementTopic,
      serviceBusUrl: secretEnvs.busConnectionString,
    };
    this.odbFrontDoorUrl = localEnvs.odbFrontDoorUrl;
  }
}

export function getAppConfiguration(): IAppConfiguration {
  const localEnvs = new LocalEnvs();
  const secretEnvs = new SecretEnvs();
  return new AppConfiguration(localEnvs, secretEnvs);
}
