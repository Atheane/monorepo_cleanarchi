import { configureMongoEventHandlerExecution, createAzureConnection } from '@oney/az-servicebus-adapters';
import { buildDomainEventDependencies } from '@oney/ddd';
import { configureLogger, defaultLogger } from '@oney/logger-adapters';
import { EventHandlerExecutionFinder, EventHandlerExecutionStore } from '@oney/messages-core';
import { Connection, createConnection } from 'mongoose';
import * as NodeCache from 'node-cache';
import { Container } from 'inversify';
import {
  BankAccountGateway,
  BankAccountRepositoryRead,
  BankAccountRepositoryWrite,
  BatchUpdateTechnicalLimit,
  CreditGateway,
  PaymentIdentifier,
  QueryService,
  UpdateTechnicalLimit,
  WriteService,
} from '@oney/payment-core';
import {
  OdbBankAccountMapper,
  OdbBankAccountRepository,
  OdbBankAccountRepositoryWrite,
  SmoneyConf,
  SmoneyBankAccountGateway,
  OdbCreditGateway,
  getAccessToken,
  SmoneyNetworkProvider,
  MongoDbQueryService,
  MongoDbWriteService,
  InMemoryQueryService,
  InMemoryWriteService,
} from '@oney/payment-adapters';
import {
  configureIdentityLib,
  getServiceHolderIdentity,
  IdentityConfiguration,
} from '@oney/identity-adapters';
import { NodeCacheGateway, ServiceApiProvider } from '@oney/common-adapters';
import { httpBuilder, AxiosHttpMethod } from '@oney/http';
import { ServiceName } from '@oney/identity-core';
import { CacheGateway, TokenType } from '@oney/common-core';
import { IAzfConfiguration } from '../envs';

export class AzfKernel extends Container {
  constructor(private inMemory: boolean, private config: IAzfConfiguration) {
    super();
    configureLogger(this);
  }

  async initDependencies(): Promise<void> {
    this.initUsecases();
    this.initRepositories();
    await this.initGateways();
    this.initMappers();
  }

  private initUsecases(): void {
    this.bind(UpdateTechnicalLimit).toSelf();
    this.bind(BatchUpdateTechnicalLimit).toSelf();
  }

  private async initGateways(): Promise<void> {
    const smoneyHttpClient = await this.initClient(this, this.config.smoneyConf);
    this.bind<BankAccountGateway>(PaymentIdentifier.bankAccountGateway).toConstantValue(
      new SmoneyBankAccountGateway(smoneyHttpClient, this.config.smoneyConf.smoneyBic),
    );
  }

  private initRepositories() {
    this.bind<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite).to(
      OdbBankAccountRepositoryWrite,
    );
    this.bind<BankAccountRepositoryRead>(PaymentIdentifier.bankAccountRepositoryRead).to(
      OdbBankAccountRepository,
    );
  }

  private initMappers() {
    this.bind<OdbBankAccountMapper>(OdbBankAccountMapper).toSelf();
  }

  public initMessagingPlugin(): void {
    const { connectionString, topic, subscription } = this.config.serviceBusConfiguration;
    configureMongoEventHandlerExecution(this);
    const messagingPlugin = createAzureConnection(
      connectionString,
      subscription,
      topic,
      defaultLogger,
      this.get(EventHandlerExecutionFinder),
      this.get(EventHandlerExecutionStore),
    );
    buildDomainEventDependencies(this).usePlugin(messagingPlugin);
  }

  async initServiceDependencies(identityConfig: IdentityConfiguration): Promise<void> {
    await configureIdentityLib(this, identityConfig);
    const authAccessServiceKey = await getServiceHolderIdentity(this, ServiceName.payment);
    const serviceApiProvider = new ServiceApiProvider(
      httpBuilder(new AxiosHttpMethod())
        .setBaseUrl(`${this.config.frontDoorApiBaseUrl}`)
        .setDefaultHeaders({
          Authorization: `Bearer ${authAccessServiceKey}`,
        }),
      'SERVICE_API_ERROR',
    );

    this.bind<CreditGateway>(PaymentIdentifier.creditGateway).toConstantValue(
      new OdbCreditGateway(serviceApiProvider),
    );
  }

  private async initClient(
    container: Container,
    smoneyConfiguration: SmoneyConf,
  ): Promise<SmoneyNetworkProvider> {
    const cacheProvider = container.get<CacheGateway>(PaymentIdentifier.cacheGateway);
    const authHttpClient = httpBuilder(new AxiosHttpMethod()).setBaseUrl(smoneyConfiguration.getTokenUrl);
    const smoneyHttpClient = httpBuilder(new AxiosHttpMethod()).setBaseUrl(smoneyConfiguration.baseUrl);

    const { accessToken, expireDate } = await getAccessToken(authHttpClient, smoneyConfiguration);
    cacheProvider.set(TokenType.ACCESS_TOKEN, accessToken, expireDate);
    smoneyHttpClient.setAdditionnalHeaders({ Authorization: `Bearer ${accessToken}` }, true);

    // Create action function to be executed on token expiration
    const actionOnExpired = async (key, value) => {
      let accessToken, expireDate;
      try {
        const result = await getAccessToken(authHttpClient, smoneyConfiguration);
        accessToken = result.accessToken;
        expireDate = result.expireDate;
        smoneyHttpClient.setAdditionnalHeaders({ Authorization: `Bearer ${accessToken}` }, true);
      } catch (e) {
        console.log('Error when getting new S-Money Access Token', e);
      }
      cacheProvider.set(key, accessToken || value, expireDate || 1);
    };
    cacheProvider.onExpiration(actionOnExpired);

    return new SmoneyNetworkProvider(smoneyHttpClient, smoneyConfiguration.smoneyBic);
  }

  useDb(inMemory = true, mongoUri?: string): this {
    const inMemoryDb: Map<string, any> = new Map<string, any>();

    if (!inMemory) {
      const connection = createConnection(mongoUri || this.config.cosmosDbConfiguration.mongoPath, {
        useNewUrlParser: true,
      });
      if (!this.isBound(Connection)) {
        this.bind(Connection).toConstantValue(connection);
      }
    }

    this.bind<QueryService>(PaymentIdentifier.accountManagementQueryService).toDynamicValue(() => {
      /* istanbul ignore if: As we connect directly to account management db, we ignore test with mongodb. */
      if (!inMemory) {
        return new MongoDbQueryService(
          mongoUri || this.config.cosmosDbConfiguration.mongoPath,
          this.config.cosmosDbConfiguration.accountManagementCollection,
          this.config.cosmosDbConfiguration.accountManagementDatabaseName,
        );
      }
      return new InMemoryQueryService(inMemoryDb);
    });

    this.bind<WriteService>(PaymentIdentifier.accountManagementWriteService).toDynamicValue(() => {
      /* istanbul ignore if: As we connect directly to account management db, we ignore test with mongodb. */
      if (!inMemory) {
        return new MongoDbWriteService(
          mongoUri || this.config.cosmosDbConfiguration.mongoPath,
          this.config.cosmosDbConfiguration.accountManagementCollection,
          this.config.cosmosDbConfiguration.accountManagementDatabaseName,
        );
      }
      return new InMemoryWriteService(inMemoryDb);
    });

    return this;
  }

  initCache(): void {
    const cache = new NodeCache({ checkperiod: 5 });
    this.bind<CacheGateway>(PaymentIdentifier.cacheGateway).toConstantValue(new NodeCacheGateway(cache));
  }
}
