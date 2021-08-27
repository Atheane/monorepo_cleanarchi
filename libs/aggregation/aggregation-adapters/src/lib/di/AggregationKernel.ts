import { configureLogger } from '@oney/logger-adapters';
import { SymLogger } from '@oney/logger-core';
import { EventHandlerExecutionFinder, EventHandlerExecutionStore } from '@oney/messages-core';
import { Container } from 'inversify';
import { buildDomainEventDependencies } from '@oney/ddd';
import { ApiProvider } from '@oney/common-core';
import { ServiceApi, ServiceApiProvider } from '@oney/common-adapters';
import { AxiosHttpMethod, httpBuilder } from '@oney/http';
import {
  configureInMemoryEventHandlerExecution,
  configureMongoEventHandlerExecution,
  createAzureConnection,
} from '@oney/az-servicebus-adapters';
import { configureEventHandler } from '@oney/messages-adapters';
import { configureIdentityLib } from '@oney/identity-adapters';
import { EvaluateBankAccountToUncapLimits } from '@oney/payment-messages';
import {
  AggregateAccounts,
  AggregationIdentifier,
  BankAccountGateway,
  BankConnectionGateway,
  BankConnectionRepository,
  BankRepository,
  UserRepository,
  CompleteSignInWithSca,
  CreditDecisioningService,
  GetAccountsByConnectionId,
  GetAllBankAccounts,
  GetAllBanks,
  GetAllTransactions,
  GetBankById,
  GetConnectionById,
  GetConnectionsOwnedByUser,
  GetTransactionsByConnectionId,
  GetUserCreditProfile,
  HydrateBankAccountService,
  IdGenerator,
  PostAllTransactions,
  ScaConnectionGateway,
  SignIn,
  SynchronizeConnection,
  TriggerSca,
  DeleteBankConnection,
  UserGateway,
  UpdateConnection,
  DeleteUser,
  IAppConfiguration,
  UserDeletedHandler,
  FileStorageService,
  GetTerms,
  SaveUserConsent,
  CheckUserConsent,
  BankAccountRepository,
  EvaluateBankAccountToUncapLimitsHandler,
  GetCategorizedTransactions,
  UploadUserDataToCreditDecisioningPartner,
  SendUserRevenueDataToUpcapLimit,
} from '@oney/aggregation-core';
import { UserDeleted } from '@oney/authentication-messages';
import { ServiceName } from '@oney/identity-core';
import { Connection, connection } from 'mongoose';
import { DomainDependencies } from './DomainDependencies';
import { InMemoryDependencies } from './inMemory/InMemoryDependencies';
import { RealDependencies } from './realDependencies/RealDependencies';
import {
  BankMapper,
  BankConnectionMapper,
  BankAccountMapper,
  ConnectionStateMapper,
  AlgoanBankAccountMapper,
  AlgoanBankAccountTypeMapper,
  BudgetInsightBankAccountTypeMapper,
  BudgetInsightTransactionMapper,
  AlgoanTransactionTypeMapper,
  AlgoanTransactionMapper,
  CreditProfileMapper,
  BIBankConnectionGateway,
  BIScaConnectionGateway,
  UuidGenerator,
  BIUserGateway,
  BIBankAccountGateway,
  BIBankRepository,
  BIHydrateBankAccountService,
  BIConnectionService,
  AlgoanCreditDecisioningService,
  OwnerIdentityMapper,
  BlobFileStorageService,
} from '../adapters';
import { PP2ReveConnectionService } from '../adapters/partners/pp2Reve/PP2ReveConnectionService';

export class AggregationKernel extends Container {
  constructor(private readonly config: IAppConfiguration) {
    super();
    configureLogger(this);
  }

  async initDependencies(inMemory: boolean): Promise<void> {
    if (!this.isBound(Connection)) {
      this.bind(Connection).toConstantValue(connection);
    }

    if (inMemory) {
      configureInMemoryEventHandlerExecution(this);
      InMemoryDependencies.initDependencies(this);
    } else {
      configureMongoEventHandlerExecution(this);
      RealDependencies.initDependencies(this);
    }

    const { connectionString, subscription, aggregationTopic } = this.config.serviceBus;

    buildDomainEventDependencies(this).usePlugin(
      createAzureConnection(
        connectionString,
        subscription,
        aggregationTopic,
        this.get(SymLogger),
        this.get(EventHandlerExecutionFinder),
        this.get(EventHandlerExecutionStore),
      ),
    );

    this.initConfigs();
    this.initApiProvider();
    this.initGateways();
    this.initMappers();
    this.initRepositories();
    this.initServices();
    this.initUsecases();

    await this.initIdentityLib();
    await this.initSubscribers();
  }

  initConfigs(): void {
    this.bind<IAppConfiguration>(AggregationIdentifier.appConfiguration).toConstantValue(this.config);
  }

  initApiProvider(): void {
    this.bind<ApiProvider<ServiceApi>>(AggregationIdentifier.serviceApiProvider).toConstantValue(
      new ServiceApiProvider(
        httpBuilder(new AxiosHttpMethod()).setBaseUrl(this.config.odbApiFrontDoor),
        'SERVICE_API_ERROR',
      ),
    );
  }

  async initIdentityLib(): Promise<void> {
    await configureIdentityLib(this, {
      secret: this.config.jwtSecret,
      azureTenantId: this.config.azureTenantId,
      jwtOptions: {},
      serviceName: ServiceName.aggregation,
      azureClientIds: {
        oney_compta: null,
        pp_de_reve: null,
      },
      applicationId: null,
    });
  }

  initUsecases(): void {
    this.bind<GetAllBanks>(GetAllBanks).to(GetAllBanks);
    this.bind<GetBankById>(GetBankById).to(GetBankById);
    this.bind<SignIn>(SignIn).to(SignIn);
    this.bind<TriggerSca>(TriggerSca).to(TriggerSca);
    this.bind<CompleteSignInWithSca>(CompleteSignInWithSca).to(CompleteSignInWithSca);
    this.bind<GetAllBankAccounts>(GetAllBankAccounts).to(GetAllBankAccounts);
    this.bind<GetAccountsByConnectionId>(GetAccountsByConnectionId).to(GetAccountsByConnectionId);
    this.bind<SynchronizeConnection>(SynchronizeConnection).to(SynchronizeConnection);
    this.bind<GetConnectionById>(GetConnectionById).to(GetConnectionById);
    this.bind<AggregateAccounts>(AggregateAccounts).to(AggregateAccounts);
    this.bind<GetConnectionsOwnedByUser>(GetConnectionsOwnedByUser).to(GetConnectionsOwnedByUser);
    this.bind<GetTransactionsByConnectionId>(GetTransactionsByConnectionId).to(GetTransactionsByConnectionId);
    this.bind<GetAllTransactions>(GetAllTransactions).to(GetAllTransactions);
    this.bind<PostAllTransactions>(PostAllTransactions).to(PostAllTransactions);
    this.bind<GetCategorizedTransactions>(GetCategorizedTransactions).to(GetCategorizedTransactions);
    this.bind<GetUserCreditProfile>(GetUserCreditProfile).to(GetUserCreditProfile);
    this.bind<DeleteBankConnection>(DeleteBankConnection).to(DeleteBankConnection);
    this.bind<UpdateConnection>(UpdateConnection).to(UpdateConnection);
    this.bind<DeleteUser>(DeleteUser).to(DeleteUser);
    this.bind<GetTerms>(GetTerms).to(GetTerms);
    this.bind<SaveUserConsent>(SaveUserConsent).to(SaveUserConsent);
    this.bind<CheckUserConsent>(CheckUserConsent).to(CheckUserConsent);
    this.bind<UploadUserDataToCreditDecisioningPartner>(UploadUserDataToCreditDecisioningPartner).to(
      UploadUserDataToCreditDecisioningPartner,
    );
    this.bind<SendUserRevenueDataToUpcapLimit>(SendUserRevenueDataToUpcapLimit).to(
      SendUserRevenueDataToUpcapLimit,
    );
  }

  private initMappers(): void {
    const {
      budgetInsightConfiguration,
      blobStorageConfiguration: { endpoint },
    } = this.config;
    const bankMapper = new BankMapper(budgetInsightConfiguration, endpoint);
    this.bind<BankMapper>(AggregationIdentifier.bankMapper).toConstantValue(bankMapper);
    this.bind<BankConnectionMapper>(AggregationIdentifier.bankConnectionMapper).to(BankConnectionMapper);
    this.bind<BankAccountMapper>(AggregationIdentifier.bankAccountMapper).to(BankAccountMapper);
    this.bind<ConnectionStateMapper>(AggregationIdentifier.connectionStateMapper).to(ConnectionStateMapper);
    this.bind<OwnerIdentityMapper>(AggregationIdentifier.ownerIdentityMapper).to(OwnerIdentityMapper);
    this.bind<AlgoanBankAccountMapper>(AggregationIdentifier.algoanBankAccountMapper).to(
      AlgoanBankAccountMapper,
    );
    this.bind<AlgoanBankAccountTypeMapper>(AggregationIdentifier.algoanBankAccountTypeMapper).to(
      AlgoanBankAccountTypeMapper,
    );
    this.bind<BudgetInsightBankAccountTypeMapper>(
      AggregationIdentifier.budgetInsightBankAccountTypeMapper,
    ).to(BudgetInsightBankAccountTypeMapper);
    this.bind<BudgetInsightTransactionMapper>(AggregationIdentifier.budgetInsightTransactionMapper).to(
      BudgetInsightTransactionMapper,
    );
    this.bind<AlgoanTransactionTypeMapper>(AggregationIdentifier.algoanTransactionTypeMapper).to(
      AlgoanTransactionTypeMapper,
    );
    this.bind<AlgoanTransactionMapper>(AggregationIdentifier.algoanTransactionMapper).to(
      AlgoanTransactionMapper,
    );
    this.bind<CreditProfileMapper>(AggregationIdentifier.creditProfileMapper).to(CreditProfileMapper);
  }

  private initGateways(): void {
    this.bind<BankConnectionGateway>(AggregationIdentifier.bankConnectionGateway).to(BIBankConnectionGateway);
    this.bind<ScaConnectionGateway>(AggregationIdentifier.scaConnectionGateway).to(BIScaConnectionGateway);
    this.bind<IdGenerator>(AggregationIdentifier.idGenerator).to(UuidGenerator);
    this.bind<UserGateway>(AggregationIdentifier.userGateway).to(BIUserGateway);
    this.bind<BankAccountGateway>(AggregationIdentifier.bankAccountGateway).to(BIBankAccountGateway);
  }

  private initRepositories(): void {
    this.bind<BankRepository>(AggregationIdentifier.bankRepository).to(BIBankRepository);
    this.bind<HydrateBankAccountService>(AggregationIdentifier.hydrateBankAccountService).to(
      BIHydrateBankAccountService,
    );
  }

  private initServices(): void {
    this.bind(BIConnectionService).toConstantValue(new BIConnectionService(this.config));
    this.bind(PP2ReveConnectionService).toConstantValue(new PP2ReveConnectionService(this.config));
    this.bind<CreditDecisioningService>(AggregationIdentifier.creditDecisioningService).to(
      AlgoanCreditDecisioningService,
    );
    this.bind<FileStorageService>(AggregationIdentifier.fileStorageService).to(BlobFileStorageService);
  }

  getDependencies(): DomainDependencies {
    return {
      getAllBanks: this.get(GetAllBanks),
      getBankById: this.get(GetBankById),
      signIn: this.get(SignIn),
      completeSignInWithSca: this.get(CompleteSignInWithSca),
      getAllBankAccounts: this.get(GetAllBankAccounts),
      synchronizeConnection: this.get(SynchronizeConnection),
      getConnectionById: this.get(GetConnectionById),
      getAccountsByConnectionId: this.get(GetAccountsByConnectionId),
      aggregateAccounts: this.get(AggregateAccounts),
      triggerSca: this.get(TriggerSca),
      updateConnection: this.get(UpdateConnection),
      getConnectionsOwnedByUser: this.get(GetConnectionsOwnedByUser),
      getTransactionsByConnectionId: this.get(GetTransactionsByConnectionId),
      getAllTransactions: this.get(GetAllTransactions),
      postAllTransactions: this.get(PostAllTransactions),
      getUserCreditProfile: this.get(GetUserCreditProfile),
      deleteBankConnection: this.get(DeleteBankConnection),
      deleteUser: this.get(DeleteUser),
      getTerms: this.get(GetTerms),
      saveUserConsent: this.get(SaveUserConsent),
      checkUserConsent: this.get(CheckUserConsent),
      uploadUserDataToCreditDecisioningPartner: this.get(UploadUserDataToCreditDecisioningPartner),
      sendUserRevenueDataToUpcapLimit: this.get(SendUserRevenueDataToUpcapLimit),
      mappers: {
        bankMapper: this.get<BankMapper>(AggregationIdentifier.bankMapper),
        bankConnectionMapper: this.get<BankConnectionMapper>(AggregationIdentifier.bankConnectionMapper),
        connectionStateMapper: this.get<ConnectionStateMapper>(AggregationIdentifier.connectionStateMapper),
        bankAccountMapper: this.get<BankAccountMapper>(AggregationIdentifier.bankAccountMapper),
        budgetInsightBankAccountTypeMapper: this.get<BudgetInsightBankAccountTypeMapper>(
          AggregationIdentifier.budgetInsightBankAccountTypeMapper,
        ),
        budgetInsightTransactionMapper: this.get<BudgetInsightTransactionMapper>(
          AggregationIdentifier.budgetInsightTransactionMapper,
        ),
        algoanBankAccountTypeMapper: this.get<AlgoanBankAccountTypeMapper>(
          AggregationIdentifier.algoanBankAccountTypeMapper,
        ),
        algoanTransactionMapper: this.get<AlgoanTransactionMapper>(
          AggregationIdentifier.algoanTransactionMapper,
        ),
        creditProfileMapper: this.get<CreditProfileMapper>(AggregationIdentifier.creditProfileMapper),
        ownerIdentityMapper: this.get<OwnerIdentityMapper>(AggregationIdentifier.ownerIdentityMapper),
      },
      bankConnectionGateway: this.get<BankConnectionGateway>(AggregationIdentifier.bankConnectionGateway),
      scaConnectionGateway: this.get<ScaConnectionGateway>(AggregationIdentifier.scaConnectionGateway),
      bankAccountGateway: this.get<BankAccountGateway>(AggregationIdentifier.bankAccountGateway),
      biBankAccountGateway: this.get<BIBankAccountGateway>(AggregationIdentifier.bankAccountGateway),
      userRepository: this.get<UserRepository>(AggregationIdentifier.userRepository),
      bankConnectionRepository: this.get<BankConnectionRepository>(
        AggregationIdentifier.bankConnectionRepository,
      ),
      bankAccountRepository: this.get<BankAccountRepository>(AggregationIdentifier.bankAccountRepository),
      creditDecisioningService: this.get<CreditDecisioningService>(
        AggregationIdentifier.creditDecisioningService,
      ),
      getCategorizedTransactions: this.get(GetCategorizedTransactions),
    };
  }
  async initSubscribers(): Promise<void> {
    await configureEventHandler(this, em => {
      em.register(UserDeleted, UserDeletedHandler, {
        topic: this.config.serviceBus.authenticationTopic,
      });
      em.register(EvaluateBankAccountToUncapLimits, EvaluateBankAccountToUncapLimitsHandler, {
        topic: this.config.serviceBus.paymentTopic,
      });
    });
  }
}
