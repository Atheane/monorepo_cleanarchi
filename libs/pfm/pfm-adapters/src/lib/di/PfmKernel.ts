import { configureLogger } from '@oney/logger-adapters';
import { SymLogger } from '@oney/logger-core';
import { configureEventHandler } from '@oney/messages-adapters';
import { EventDispatcher, EventReceiver } from '@oney/messages-core';
import { Container } from 'inversify';
import { ApiProvider } from '@oney/common-core';
import { ServiceApi, ServiceApiProvider } from '@oney/common-adapters';
import { AxiosHttpMethod, httpBuilder } from '@oney/http';
import { PaymentCreated } from '@oney/payment-messages';
import { configureIdentityLib } from '@oney/identity-adapters';
import { ServiceName } from '@oney/identity-core';
import {
  PaymentCreatedEventHandler,
  PfmIdentifiers,
  P2pRepository,
  AccountStatementRepository,
  TransactionRepository,
  BankAccountRepository,
  IdGenerator,
  TransactionService,
  BankAccountService,
  AccountStatementService,
  FileStorage,
  GetAllBankAccounts,
  GetTransactionById,
  GetTransactionsByAccountId,
  CreateP2p,
  GetAllTransactions,
  GetListAccountStatements,
  GetOneAccountStatement,
  ProcessStatements,
  UserRepository,
  BusDelivery,
  IAppConfiguration,
  ProcessMonthlyStatements,
} from '@oney/pfm-core';
import { MessagingPlugin, buildDomainEventDependencies } from '@oney/ddd';
import { Connection } from 'mongoose';
import * as mongoose from 'mongoose';
import { EventsManager } from './EventsManager';
import { DomainDependencies } from './DomainDependencies';
import { SMoneyTransactionRepository } from '../adapters/repositories/transaction/SMoneyTransactionRepository';
import { SMoneyBankAccountRepository } from '../adapters/repositories/bankAccount/SMoneyBankAccountRepository';
import { AggregationBankAccountRepository } from '../adapters/repositories/bankAccount/AggregationBankAccountRepository';
import { BudgetInsightTransactionRepository } from '../adapters/mongodb/repositories/BudgetInsightTransactionRepository';
import {
  GetAccountStatementService,
  GetBankAccountsService,
  GetTransactionsService,
} from '../adapters/services';
import { AzureStorageBlob } from '../adapters/fileStorage';
import { UuidGenerator } from '../adapters/gateways/UuidGenerator';
import {
  P2pMongoMapper,
  TransactionMapper,
  BankAccountMapper,
  AccountStatementMapper,
  TransactionBudgetInsightMapper,
  TransactionSMoneyMapper,
  BankAccountAggregationMapper,
  TransactionSmoneyP2pMapper,
  BankAccountSMoneyMapper,
  UserMapper,
} from '../adapters/mappers';
import {
  MongoDbAccountStatementRepository,
  MongodbUserRepository,
  MongodbP2pRepository,
} from '../adapters/mongodb/repositories';
import {
  connectAccountStatementModel,
  connectEventModel,
  connectP2pModel,
  connectUserModel,
} from '../adapters/mongodb/models';
import { AzureBusDelivery, getBusClient } from '../adapters/azureBus';

export class PfmKernel extends Container {
  private readonly eventsConfiguration;
  private readonly azureBlobStorageConfiguration;
  private readonly dbConnection;

  constructor(private readonly config: IAppConfiguration, dbConnection: mongoose.Connection) {
    super();
    this.dbConnection = dbConnection;
    this.eventsConfiguration = config.eventsConfig;
    this.azureBlobStorageConfiguration = config.azureBlobStorageConfiguration;

    if (!this.isBound(Connection)) {
      this.bind(Connection).toConstantValue(this.dbConnection);
    }

    configureLogger(this);
  }

  initDependencies(): PfmKernel {
    this.initConfigs();
    this.initApiProvider();
    this.initRepositories();
    this.initUsecases();
    this.initServices();
    this.initMappers();
    // TODO remove initBus
    this.initBus();
    return this;
  }

  private initConfigs(): void {
    this.bind<IAppConfiguration>(PfmIdentifiers.configuration).toConstantValue(this.config);
  }

  private initRepositories(): void {
    this.bind<BankAccountRepository>(PfmIdentifiers.smoneyBankAccountRepository).to(
      SMoneyBankAccountRepository,
    );
    this.bind<BankAccountRepository>(PfmIdentifiers.aggregationBankAccountRepository).to(
      AggregationBankAccountRepository,
    );

    this.bind<TransactionRepository>(PfmIdentifiers.smoneyTransactionRepository).to(
      SMoneyTransactionRepository,
    );
    this.bind<AccountStatementRepository>(PfmIdentifiers.accountStatementRepository).toConstantValue(
      new MongoDbAccountStatementRepository(
        connectAccountStatementModel(this.dbConnection.useDb(this.config.mongoDBPfmConfiguration.name)),
        new AccountStatementMapper(),
      ),
    );
    this.bind<BudgetInsightTransactionRepository>(
      PfmIdentifiers.budgetInsightTransactionRepository,
    ).toConstantValue(
      new BudgetInsightTransactionRepository(
        connectEventModel(this.dbConnection.useDb(this.config.mongoDBEventStoreConfiguration.name)),
        new TransactionBudgetInsightMapper(),
        this.get(SymLogger),
      ),
    );
    this.bind<P2pRepository>(PfmIdentifiers.p2pRepository).toConstantValue(
      new MongodbP2pRepository(
        connectP2pModel(this.dbConnection.useDb(this.config.mongoDBEventStoreConfiguration.name)),
        new P2pMongoMapper(),
      ),
    );
    this.bind<UserRepository>(PfmIdentifiers.userRepository).toConstantValue(
      new MongodbUserRepository(
        connectUserModel(this.dbConnection.useDb(this.config.mongoDBAccountConfiguration.name)),
        new UserMapper(),
      ),
    );
  }

  initBlobStorage(): PfmKernel {
    this.bind<FileStorage>(PfmIdentifiers.fileStorage).toConstantValue(
      new AzureStorageBlob(this.config.azureBlobStorageConfiguration),
    );
    return this;
  }

  initApiProvider(): void {
    this.bind<ApiProvider<ServiceApi>>(PfmIdentifiers.serviceApiProvider).toConstantValue(
      new ServiceApiProvider(
        httpBuilder(new AxiosHttpMethod()).setBaseUrl(this.config.odbFrontDoorUrl),
        'SERVICE_API_ERROR',
      ),
    );
  }

  async initIdentityLib(): Promise<PfmKernel> {
    await configureIdentityLib(this, {
      secret: this.config.vault.jwtSecret,
      azureTenantId: this.config.azureAdTenantId,
      jwtOptions: {},
      serviceName: ServiceName.pfm,
      azureClientIds: {
        oney_compta: null,
        pp_de_reve: null,
      },
      applicationId: null,
    });
    return this;
  }

  initBus(): void {
    this.bind<BusDelivery>(PfmIdentifiers.busDelivery).toConstantValue(
      new AzureBusDelivery(getBusClient(this.config.eventsConfig.serviceBusUrl)),
    );
  }

  private initUsecases(): void {
    this.bind<GetAllBankAccounts>(GetAllBankAccounts).to(GetAllBankAccounts);
    this.bind<GetAllTransactions>(GetAllTransactions).to(GetAllTransactions);
    this.bind<GetTransactionsByAccountId>(GetTransactionsByAccountId).to(GetTransactionsByAccountId);
    this.bind<GetTransactionById>(GetTransactionById).to(GetTransactionById);
    this.bind<CreateP2p>(CreateP2p).to(CreateP2p);
    this.bind<GetListAccountStatements>(GetListAccountStatements).to(GetListAccountStatements);
    this.bind<GetOneAccountStatement>(GetOneAccountStatement).to(GetOneAccountStatement);
    this.bind<ProcessStatements>(ProcessStatements).to(ProcessStatements);
    this.bind<ProcessMonthlyStatements>(ProcessMonthlyStatements).to(ProcessMonthlyStatements);
  }

  private initServices(): PfmKernel {
    this.bind<BankAccountService>(PfmIdentifiers.bankAccountsService).to(GetBankAccountsService);
    this.bind<TransactionService>(PfmIdentifiers.transactionsService).to(GetTransactionsService);
    this.bind<AccountStatementService>(PfmIdentifiers.accountStatementService).to(GetAccountStatementService);
    this.bind<IdGenerator>(PfmIdentifiers.idGenerator).to(UuidGenerator);
    return this;
  }

  private initMappers(): void {
    this.bind<BankAccountAggregationMapper>(PfmIdentifiers.mappers.bankAccountAggregationMapper).to(
      BankAccountAggregationMapper,
    );
    this.bind<BankAccountSMoneyMapper>(PfmIdentifiers.mappers.bankAccountSMoneyMapper).to(
      BankAccountSMoneyMapper,
    );
    this.bind<TransactionBudgetInsightMapper>(PfmIdentifiers.mappers.transactionBudgetInsightMapper).to(
      TransactionBudgetInsightMapper,
    );
    this.bind<TransactionSMoneyMapper>(PfmIdentifiers.mappers.transactionSMoneyMapper).to(
      TransactionSMoneyMapper,
    );
    this.bind<TransactionSmoneyP2pMapper>(PfmIdentifiers.mappers.transactionSMoneyP2pMapper).to(
      TransactionSmoneyP2pMapper,
    );
    this.bind<P2pMongoMapper>(PfmIdentifiers.mappers.p2pMongoMapper).to(P2pMongoMapper);
    this.bind<BankAccountMapper>(PfmIdentifiers.mappers.bankAccountMapper).to(BankAccountMapper);
    this.bind<TransactionMapper>(PfmIdentifiers.mappers.transactionMapper).to(TransactionMapper);
    this.bind<AccountStatementMapper>(PfmIdentifiers.mappers.accountStatementMapper).to(
      AccountStatementMapper,
    );
    this.bind<UserMapper>(PfmIdentifiers.mappers.userMapper).to(UserMapper);
  }

  useServiceBus(messagingPlugin: MessagingPlugin): PfmKernel {
    buildDomainEventDependencies(this).usePlugin(messagingPlugin);
    return this;
  }

  getEventsManager(): EventsManager {
    return {
      eventDispatcher: this.get(EventDispatcher),
      eventReceiver: this.get(EventReceiver),
    };
  }

  async initSubscribers(): Promise<PfmKernel> {
    await configureEventHandler(this, em => {
      // @oney/payment -> this.config.eventsConfig.paymentTopic,
      em.register(PaymentCreated, PaymentCreatedEventHandler, {
        topic: this.config.eventsConfig.paymentTopic,
      });
    });

    return this;
  }

  getDependencies(): DomainDependencies {
    return {
      createP2p: this.get(CreateP2p),
      getAllBankAccounts: this.get(GetAllBankAccounts),
      getAllTransactions: this.get(GetAllTransactions),
      getTransactionsByAccountId: this.get(GetTransactionsByAccountId),
      getListAccountStatements: this.get(GetListAccountStatements),
      getOneAccountStatement: this.get(GetOneAccountStatement),
      getTransactionById: this.get(GetTransactionById),
      p2pRepository: this.get<MongodbP2pRepository>(PfmIdentifiers.p2pRepository),
      userRepository: this.get<MongodbUserRepository>(PfmIdentifiers.userRepository),
      accountStatementRepository: this.get<MongoDbAccountStatementRepository>(
        PfmIdentifiers.accountStatementRepository,
      ),
      processStatements: this.get(ProcessStatements),
      processMonthlyStatements: this.get(ProcessMonthlyStatements),
      mappers: {
        bankAccountAggregationMapper: this.get<BankAccountAggregationMapper>(
          PfmIdentifiers.mappers.bankAccountAggregationMapper,
        ),
        transactionSMoneyMapper: this.get<TransactionSMoneyMapper>(
          PfmIdentifiers.mappers.transactionSMoneyMapper,
        ),
        bankAccountMapper: this.get<BankAccountMapper>(PfmIdentifiers.mappers.bankAccountMapper),
        transactionMapper: this.get<TransactionMapper>(PfmIdentifiers.mappers.transactionMapper),
        accountStatementMapper: this.get<AccountStatementMapper>(
          PfmIdentifiers.mappers.accountStatementMapper,
        ),
        userMapper: this.get<UserMapper>(PfmIdentifiers.mappers.userMapper),
      },
      getTransactionService: this.get<GetTransactionsService>(PfmIdentifiers.transactionsService),
    };
  }
}
