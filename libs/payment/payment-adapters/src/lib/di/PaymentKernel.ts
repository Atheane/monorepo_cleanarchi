import { ServiceApiProvider, NodeCacheGateway } from '@oney/common-adapters';
import { CacheGateway, TokenType, Mapper } from '@oney/common-core';
import { buildDomainEventDependencies, MessagingPlugin } from '@oney/ddd';
import {
  configureIdentityLib,
  getServiceHolderIdentity,
  IdentityConfiguration,
} from '@oney/identity-adapters';
import { ServiceName } from '@oney/identity-core';
import { configureLogger } from '@oney/logger-adapters';
import {
  TaxNoticeAnalysisRejected,
  TaxNoticeAnalysisSucceeded,
  ProfileActivated,
  UserKycDecisionUpdated,
  DocumentAdded,
} from '@oney/profile-messages';
import { configureEventHandler } from '@oney/messages-adapters';
import {
  BankAccountActivationGateway,
  BankAccountBalanceGateway,
  BankAccountGateway,
  BankAccountManagement,
  BankAccountRepositoryRead,
  BankAccountRepositoryWrite,
  BeneficiaryRepositoryRead,
  CardRepositoryRead,
  CardRepositoryWrite,
  CreateBankAccount,
  CreateCard,
  CreateP2P,
  CreateSDD,
  DebtGateway,
  GetBalance,
  GetBankAccount,
  GetBeneficiary,
  GetCard,
  GetCards,
  GetProfileInformationGateway,
  IdGenerator,
  InitiateLimits,
  KycGateway,
  MakeTransfer,
  NotifyDiligenceByAggregationToPartner,
  NotifyUpdateBankAccount,
  OperationGateway,
  OrderRaisingLimits,
  PaymentIdentifier,
  PaymentRepositoryWrite,
  QueryService,
  SendKycDocument,
  StorageGateway,
  SyncAccountDebts,
  TagRepositoryRead,
  TransferRepositoryWrite,
  UncapBankAccountUsingAggregatedAccounts,
  UpdateBankAccount,
  UpdateCard,
  UpdateCardStatus,
  UpdateMonthlyAllowance,
  WriteService,
  UpdateBankAccountEligibility,
  CreateCOP,
  CalculateBankAccountExposure,
  BankAccountExposureGateway,
  CheckToEvaluateAccount,
  OperationRepositoryWrite,
  AskUncapping,
  RejectUncapping,
  UpdateSplitPaymentEligibility,
  UpdateTechnicalLimit,
  CreditGateway,
  UpdateGlobalOut,
  Uncap,
  ExtractClearingBatch,
  BatchUpdateTechnicalLimit,
  OrderDebtsCollection,
  CollectDebt,
  P2PDebtCollectionConfig,
  PZP_DEBT_COLLECTION_REFERENCE,
  CreateClearing,
  ApplyLocalLimits,
  GlobalLimits,
  CardGateway,
  DisplayCardDetails,
  DisplayCardPin,
  CardHmac,
  CreateBeneficiary,
  GetBankIdentityStatement,
} from '@oney/payment-core';
import { httpBuilder, AxiosHttpMethod } from '@oney/http';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import {
  CardStatusUpdateReceived,
  CardTransactionReceived,
  ClearingReceived,
  PaymentCreated,
  RawSmoDebtReceived,
  SctOutExecuted,
  SDDReceived,
  COPReceived,
  CheckAggregatedAccountsIncomes,
  ClearingBatchReceived,
  DebtsCollectionOrdered,
  SctInReceived,
  ClearingOperationReceived,
  KycDiligenceApiErrorReason,
} from '@oney/payment-messages';
import { SymLogger } from '@oney/logger-core';
import {
  AccountEligibilityCalculated,
  X3X4EligibilityCalculated,
  CustomBalanceLimitCalculated,
  AggregatedAccountsIncomesChecked,
} from '@oney/cdp-messages';
import { Container } from 'inversify';
import { Connection, createConnection } from 'mongoose';
import * as NodeCache from 'node-cache';
import { OrderCard } from '@oney/subscription-messages';
import { SplitPaymentScheduleCreated } from '@oney/credit-messages';
import { SmoneyApiReasonMapper } from '../adapters/mappers/SmoneyApiReasonMapper';
import { Configuration, KvConfiguration, SmoneyConf } from './Configuration';
import { BlobStorageGateway } from '../adapters/gateways/BlobStorageGateway';
import { OdbBankAccountManagement } from '../adapters/gateways/OdbBankAccountManagement';
import { OdbGetProfileInformationGateway } from '../adapters/gateways/OdbGetProfileInformationGateway';
import { ShortIdGenerator } from '../adapters/gateways/ShortIdGenerator';
import { SmoneyAccountBalanceGateway } from '../adapters/gateways/SmoneyAccountBalanceGateway';
import { SmoneyBankAccountGateway } from '../adapters/gateways/SmoneyBankAccountGateway';
import { SmoneyDebtGateway } from '../adapters/gateways/SmoneyDebtGateway';
import { SmoneyKycGateway } from '../adapters/gateways/SmoneyKycGateway';
import { SmoneyNotifyBankAccountActivationGateway } from '../adapters/gateways/SmoneyNotifyBankAccountActivationGateway';
import { SmoneyOperationGateway } from '../adapters/gateways/SmoneyOperationGateway';
import { BalanceLimitUncappedCalculatedEventHandler } from '../adapters/handlers/bankAccount/BalanceLimitUncappedCalculatedEventHandler';
import { CardStatusUpdateReceivedEventHandler } from '../adapters/handlers/card/CardStatusUpdateReceivedEventHandler';
import { RawSmoDebtReceivedHandler } from '../adapters/handlers/debt/RawSmoDebtReceivedHandler';
import { SDDReceivedEventHandler } from '../adapters/handlers/operation/SDDReceivedEventHandler';
import { UserKycDecisionUpdatedEventHandler } from '../adapters/handlers/profile/UserKycDecisionUpdatedEventHandler';
import { CardTransactionReceivedEventHandler } from '../adapters/handlers/transaction/CardTransactionReceivedEventHandler';
import { ClearingReceivedEventHandler } from '../adapters/handlers/transaction/ClearingReceivedEventHandler';
import { PaymentCreatedEventHandler } from '../adapters/handlers/transaction/PaymentCreatedEventHandler';
import { SctOutExecutedEventHandler } from '../adapters/handlers/transaction/SctOutExecutedEventHandler';
import { InMemoryQueryService } from '../adapters/inmemory/query/InMemoryQueryService';
import { InMemoryWriteService } from '../adapters/inmemory/write/InMemoryWriteService';
import { OdbBankAccountMapper } from '../adapters/mappers/OdbBankAccountMapper';
import { MongoDbQueryService } from '../adapters/mongodb/MongoDbQueryService';
import { COPReceivedEventHandler } from '../adapters/handlers/operation/COPReceivedEventHandler';
import { MongoDbWriteService } from '../adapters/mongodb/MongoDbWriteService';
import { getAccessToken } from '../adapters/partners/smoney/getAccessToken';
import { SmoneyNetworkProvider } from '../adapters/partners/smoney/SmoneyNetworkProvider';
import { OdbBankAccountRepository } from '../adapters/repositories/odb/bankaccounts/OdbBankAccountRepository';
import { OdbBankAccountRepositoryWrite } from '../adapters/repositories/odb/bankaccounts/OdbBankAccountRepositoryWrite';
import { OdbBeneficiaryRepositoryRead } from '../adapters/repositories/odb/beneficiaries/OdbBeneficiaryRepositoryRead';
import { OdbCardRepositoryRead } from '../adapters/repositories/odb/cards/OdbCardRepositoryRead';
import { OdbCardRepositoryWrite } from '../adapters/repositories/odb/cards/OdbCardRepositoryWrite';
import { OdbP2PRepositoryRead } from '../adapters/repositories/odb/OdbP2PRepositoryRead';
import { SmoneyP2PRepository } from '../adapters/repositories/Smoney/SmoneyP2PRepository';
import { SmoneyTransferRepository } from '../adapters/repositories/Smoney/SmoneyTransferRepository';
import { SmoneyBankAccountExposureGateway } from '../adapters/gateways/SmoneyBankAccountExposureGateway';
import { OdbOperationRepositoryWrite } from '../adapters/repositories/odb/operations/OdbOperationRepositoryWrite';
import { MongoDbOperationsWriteService } from '../adapters/mongodb/models/MongoDbOperationsWriteService';
import { SplitPaymentEligibilityCalcultedEventHandler } from '../adapters/handlers/cdp/SplitPaymentEligibilityCalcultedEventHandler';
import { OrderCardHandler } from '../adapters/handlers/card/OrderCardHandler';
import { OfferTypeMapper } from '../adapters/mappers/OfferTypeMapper';
import { OdbCreditGateway } from '../adapters/gateways/OdbCreditGateway';
import { SplitPaymentScheduleCreatedEventHandler } from '../adapters/handlers/splitPayments/SplitPaymentScheduleCreatedEventHandler';
import { AggregatedAccountsIncomesCheckedEventHandler } from '../adapters/handlers/limits/AggregatedAccountsIncomesCheckedEventHandler';
import { TaxNoticeAnalysisSucceededEventHandler } from '../adapters/handlers/limits/TaxNoticeAnalysisSucceededEventHandler';
import { TaxNoticeAnalysisRejectedEventHandler } from '../adapters/handlers/limits/TaxNoticeAnalysisRejectedEventHandler';
import { CustomBalanceLimitCalculatedEventHandler } from '../adapters/handlers/limits/CustomBalanceLimitCalculatedEventHandler';
import { AccountEligibilityCalculatedEventHandler } from '../adapters/handlers/limits/AccountEligibilityCalculatedEventHandler';
import { CheckAggregatedAccountsIncomesEventHandler } from '../adapters/handlers/limits/CheckAggregatedAccountsIncomesEventHandler';
import { TaxNoticeUploadedEventHandler } from '../adapters/handlers/limits/TaxNoticeUploadedEventHandler';
import { SmoneyDebtMapper } from '../adapters/mappers/SmoneyDebtMapper';
import { SmoneyDebtStatusMapper } from '../adapters/mappers/SmoneyDebtStatusMapper';
import { SmoneyCurrencyUnitMapper } from '../adapters/mappers/SmoneyCurrencyUnitMapper';
import { SctInReceivedHandler } from '../adapters/handlers/transaction/SctInReceivedHandler';
import { DebtsCollectionOrderedHandler } from '../adapters/handlers/debt/DebtsCollectionOrderedHandler';
import { ClearingBatchReceivedEventHandler } from '../adapters/handlers/operation/ClearingBatchReceivedEventHandler';
import { ClearingOperationReceivedEventHandler } from '../adapters/handlers/operation/ClearingOperationReceivedEventHandler';
import { ProfileActivatedEventHandler } from '../adapters/handlers/limits/ProfileActivatedEventHandler';
import { ProfileActivatedHandler } from '../adapters/handlers/profile/ProfileActivatedHandler';
import { SmoneyCardGateway } from '../adapters/gateways/SmoneyCardGateway';
import { SmoneyCardDisplayPinMapper } from '../adapters/mappers/SmoneyCardDisplayPinMapper';
import { SmoneyCardDisplayDetailsMapper } from '../adapters/mappers/SmoneyCardDisplayDetailsMapper';
import { SmoneyCardHmacMapper } from '../adapters/mappers/SmoneyCardHmacMapper';

export class PaymentKernel extends Container {
  constructor(
    private readonly _envConfiguration: Configuration,
    private readonly _keyVaultConfiguration: KvConfiguration,
  ) {
    super();
    configureLogger(this);
  }

  async initClient(container: Container, smoneyConfiguration: SmoneyConf): Promise<SmoneyNetworkProvider> {
    const cacheProvider = container.get<NodeCacheGateway>(PaymentIdentifier.cacheGateway);
    const authHttpClient = httpBuilder(new AxiosHttpMethod()).setBaseUrl(smoneyConfiguration.getTokenUrl);
    const smoneyHttpClient = httpBuilder(new AxiosHttpMethod()).setBaseUrl(smoneyConfiguration.baseUrl);

    // Set the first access_token
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
      // We keep the expired token with a TTL=1 to force a retry in case of an S-Money error
      // TTL=0 is not used because it equals to unlimited TTL and so never expire
      cacheProvider.set(key, accessToken || value, expireDate || 1);
    };
    cacheProvider.onExpiration(actionOnExpired);

    return new SmoneyNetworkProvider(smoneyHttpClient, smoneyConfiguration.smoneyBic);
  }

  initStorage(azureBlobConnectionString: string, azureBlobContainerName: string): ContainerClient {
    const blobServiceClient = BlobServiceClient.fromConnectionString(azureBlobConnectionString);
    const blobContainerClient = blobServiceClient.getContainerClient(azureBlobContainerName);
    return blobContainerClient;
  }

  async initServiceDependencies(identityConfig: IdentityConfiguration): Promise<PaymentKernel> {
    await configureIdentityLib(this, identityConfig);
    const authAccessServiceKey = await getServiceHolderIdentity(this, ServiceName.payment);
    const serviceApiProvider = new ServiceApiProvider(
      httpBuilder(new AxiosHttpMethod())
        .setBaseUrl(`${this._envConfiguration.frontDoorApiBaseUrl}`)
        .setDefaultHeaders({
          Authorization: `Bearer ${authAccessServiceKey}`,
        }),
      'SERVICE_API_ERROR',
    );
    this.bind<GetProfileInformationGateway>(PaymentIdentifier.getProfileInformationGateway).toConstantValue(
      new OdbGetProfileInformationGateway(serviceApiProvider),
    );

    this.bind<CreditGateway>(PaymentIdentifier.creditGateway).toConstantValue(
      new OdbCreditGateway(serviceApiProvider),
    );
    return this;
  }

  initCache(): PaymentKernel {
    const cache = new NodeCache({ checkperiod: 5 });
    this.bind<CacheGateway>(PaymentIdentifier.cacheGateway).toConstantValue(new NodeCacheGateway(cache));
    return this;
  }

  async initDependencies(): Promise<PaymentKernel> {
    // Mappers
    this.bind<SmoneyCardDisplayPinMapper>(PaymentIdentifier.smoneyCardDisplayPinMapper).toConstantValue(
      new SmoneyCardDisplayPinMapper(),
    );
    this.bind<SmoneyCardHmacMapper>(PaymentIdentifier.smoneyCardHmacMapper).toConstantValue(
      new SmoneyCardHmacMapper(),
    );
    this.bind<SmoneyCardDisplayDetailsMapper>(
      PaymentIdentifier.smoneyCardDisplayDetailsMapper,
    ).toConstantValue(new SmoneyCardDisplayDetailsMapper());

    // limit values to inject
    this.bind<number>(PaymentIdentifier.uncappedBalanceLimitConfiguration).toConstantValue(
      this._envConfiguration.uncappedBalanceLimit,
    );
    this.bind<GlobalLimits>(PaymentIdentifier.globalInConfiguration).toConstantValue({
      weeklyAllowance: this._envConfiguration.globalInWeeklyAllowance,
      monthlyAllowance: this._envConfiguration.globalInMonthlyAllowance,
      annualAllowance: this._envConfiguration.globalInAnnualAllowance,
    });
    this.bind<number>(PaymentIdentifier.globalOutAnnualAllowanceConfiguration).toConstantValue(
      this._envConfiguration.globalOutAnnualAllowance,
    );

    const smoneyHttpClient = await this.initClient(this, this._keyVaultConfiguration.smoneyConfiguration);
    const blobContainerClient = this.initStorage(
      this._keyVaultConfiguration.azureBlobConnectionString,
      this._envConfiguration.azureBlobContainerName,
    );
    this.bind<P2PDebtCollectionConfig>(PaymentIdentifier.p2pdDebtCollectionConfiguration).toConstantValue({
      beneficiary: this._envConfiguration.p2pDebtCollectBeneficiary,
      reference: PZP_DEBT_COLLECTION_REFERENCE,
    });
    this.bind<OdbBankAccountMapper>(OdbBankAccountMapper).toSelf();
    this.bind(OfferTypeMapper).toSelf();
    this.bind<SmoneyDebtMapper>(SmoneyDebtMapper).toSelf();
    this.bind<SmoneyDebtStatusMapper>(SmoneyDebtStatusMapper).toSelf();
    this.bind<SmoneyCurrencyUnitMapper>(SmoneyCurrencyUnitMapper).toSelf();
    this.bind<SmoneyNetworkProvider>(PaymentIdentifier.networkProvider).toConstantValue(smoneyHttpClient);
    this.bind<IdGenerator>(PaymentIdentifier.idGenerator).to(ShortIdGenerator);
    this.bind<PaymentRepositoryWrite>(PaymentIdentifier.paymentRepositoryWrite).toConstantValue(
      new SmoneyP2PRepository(smoneyHttpClient, this.get(SymLogger)),
    );
    this.bind<CardRepositoryRead>(PaymentIdentifier.cardRepositoryRead).to(OdbCardRepositoryRead);
    this.bind<CardRepositoryWrite>(PaymentIdentifier.cardRepositoryWrite).to(OdbCardRepositoryWrite);
    this.bind<TransferRepositoryWrite>(PaymentIdentifier.transferRepository).toConstantValue(
      new SmoneyTransferRepository(smoneyHttpClient),
    );
    this.bind<TagRepositoryRead>(PaymentIdentifier.paymentRepositoryRead).to(OdbP2PRepositoryRead);
    this.bind<BankAccountGateway>(PaymentIdentifier.bankAccountGateway).toConstantValue(
      new SmoneyBankAccountGateway(
        smoneyHttpClient,
        this._keyVaultConfiguration.smoneyConfiguration.smoneyBic,
      ),
    );
    this.bind<OperationGateway>(PaymentIdentifier.operationGateway).toConstantValue(
      new SmoneyOperationGateway(smoneyHttpClient, this.get(PaymentIdentifier.idGenerator)),
    );
    this.bind<CardGateway>(PaymentIdentifier.cardGateway).toConstantValue(
      new SmoneyCardGateway(
        smoneyHttpClient,
        this._envConfiguration.channelCode,
        this.get(PaymentIdentifier.smoneyCardDisplayPinMapper),
        this.get(PaymentIdentifier.smoneyCardHmacMapper),
        this.get(PaymentIdentifier.smoneyCardDisplayDetailsMapper),
      ),
    );

    this.bind<BankAccountManagement>(PaymentIdentifier.bankAccountManagement).toConstantValue(
      new OdbBankAccountManagement({
        bankAutoBalanceAccount: this._keyVaultConfiguration.bankAccountConfiguration.bankAutoBalanceAccount,
        bankBillingAccount: this._keyVaultConfiguration.bankAccountConfiguration.bankBillingAccount,
        bankCreditAccount: this._keyVaultConfiguration.bankAccountConfiguration.bankCreditAccount,
        coverAccount: this._keyVaultConfiguration.bankAccountConfiguration.coverAccount,
        bankLossAccount: this._keyVaultConfiguration.bankAccountConfiguration.bankLossAccount,
      }),
    );
    this.bind<BankAccountRepositoryRead>(PaymentIdentifier.bankAccountRepositoryRead).to(
      OdbBankAccountRepository,
    );
    this.bind<OperationRepositoryWrite>(PaymentIdentifier.operationRepositoryWrite).to(
      OdbOperationRepositoryWrite,
    );
    this.bind<StorageGateway>(PaymentIdentifier.storageGateway).toConstantValue(
      new BlobStorageGateway(blobContainerClient, this.get(SymLogger)),
    );
    this.bind<KycGateway>(PaymentIdentifier.kycGateway).to(SmoneyKycGateway);
    this.bind<boolean>(PaymentIdentifier.featureFlagKycOnCreation).toConstantValue(
      this._envConfiguration.featureFlagKycOnCreation,
    );
    this.bind(CreateP2P).to(CreateP2P);
    this.bind(MakeTransfer).to(MakeTransfer);
    this.bind(GetCard).to(GetCard);
    this.bind(GetCards).to(GetCards);
    this.bind(UpdateCard).to(UpdateCard);
    this.bind(CreateCard).to(CreateCard);
    this.bind(SendKycDocument).to(SendKycDocument);
    this.bind(UpdateCardStatus).to(UpdateCardStatus);
    this.bind(ExtractClearingBatch).toSelf();
    this.bind(DisplayCardDetails).toSelf();
    this.bind(DisplayCardPin).toSelf();
    this.bind(CardHmac).toSelf();
    this.bind(CreateBeneficiary).toSelf();
    this.bind(GetBankIdentityStatement).toSelf();
    this.bind<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite).to(
      OdbBankAccountRepositoryWrite,
    );
    this.bind<BeneficiaryRepositoryRead>(PaymentIdentifier.beneficiaryRepositoryRead).to(
      OdbBeneficiaryRepositoryRead,
    );
    this.bind<CalculateBankAccountExposure>(CalculateBankAccountExposure).toSelf();
    this.bind(GetBeneficiary).to(GetBeneficiary);
    this.bind(GetBalance).to(GetBalance);
    this.bind<BankAccountActivationGateway>(PaymentIdentifier.bankAccountActivationGateway).toConstantValue(
      new SmoneyNotifyBankAccountActivationGateway(smoneyHttpClient),
    );
    this.bind<Mapper<KycDiligenceApiErrorReason>>(PaymentIdentifier.apiErrorReasonMapper).to(
      SmoneyApiReasonMapper,
    );
    this.bind(NotifyDiligenceByAggregationToPartner).to(NotifyDiligenceByAggregationToPartner);
    this.bind(GetBankAccount).to(GetBankAccount);
    this.bind<BankAccountBalanceGateway>(PaymentIdentifier.bankAccountBalanceGateway).to(
      SmoneyAccountBalanceGateway,
    );
    // Debt
    this.bind(SyncAccountDebts).toSelf();
    this.bind<NotifyUpdateBankAccount>(PaymentIdentifier.notifyUpdateBankAccount).to(NotifyUpdateBankAccount);
    this.bind<DebtGateway>(PaymentIdentifier.debtGateway).to(SmoneyDebtGateway);
    this.bind(UpdateMonthlyAllowance).to(UpdateMonthlyAllowance);

    this.bind(UpdateBankAccount).to(UpdateBankAccount);
    this.bind(CreateBankAccount).to(CreateBankAccount);

    this.bind(CreateSDD).to(CreateSDD);
    this.bind(CreateCOP).toSelf();
    this.bind(CreateClearing).toSelf();
    this.bind(UpdateBankAccountEligibility).toSelf();
    // Limits
    this.bind(OrderRaisingLimits).to(OrderRaisingLimits);
    this.bind(ApplyLocalLimits).to(ApplyLocalLimits);
    this.bind(AskUncapping).to(AskUncapping);
    this.bind(RejectUncapping).to(RejectUncapping);
    this.bind(UpdateGlobalOut).to(UpdateGlobalOut);
    this.bind(Uncap).toSelf();
    this.bind(UncapBankAccountUsingAggregatedAccounts).to(UncapBankAccountUsingAggregatedAccounts);
    this.bind(CheckToEvaluateAccount).to(CheckToEvaluateAccount);
    this.bind(InitiateLimits).toSelf();
    this.bind<BankAccountExposureGateway>(PaymentIdentifier.bankAccountExposureGateway).to(
      SmoneyBankAccountExposureGateway,
    );
    this.bind(UpdateSplitPaymentEligibility).toSelf();
    this.bind(UpdateTechnicalLimit).toSelf();
    this.bind(BatchUpdateTechnicalLimit).toSelf();
    this.bind(OrderDebtsCollection).toSelf();
    this.bind(CollectDebt).toSelf();
    return this;
  }

  addMessagingPlugin(messagingPlugin: MessagingPlugin): this {
    buildDomainEventDependencies(this).usePlugin(messagingPlugin);
    return this;
  }

  useDb(inMemory: boolean, mongoUri?: string): this {
    const inMemoryDb = new Map<string, unknown>();

    if (!inMemory) {
      const connection = createConnection(mongoUri || this._keyVaultConfiguration.mongoPath, {
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
          mongoUri || this._keyVaultConfiguration.mongoPath,
          this._envConfiguration.accountManagementMongoDbCollection,
          this._envConfiguration.accountManagementMongoDbDatabase,
        );
      }
      return new InMemoryQueryService(inMemoryDb);
    });

    this.bind<WriteService>(PaymentIdentifier.accountManagementWriteService).toDynamicValue(() => {
      /* istanbul ignore if: As we connect directly to account management db, we ignore test with mongodb. */
      if (!inMemory) {
        return new MongoDbWriteService(
          mongoUri || this._keyVaultConfiguration.mongoPath,
          this._envConfiguration.accountManagementMongoDbCollection,
          this._envConfiguration.accountManagementMongoDbDatabase,
        );
      }
      return new InMemoryWriteService(inMemoryDb);
    });

    this.bind<QueryService>(PaymentIdentifier.transactionQueryService).toDynamicValue(() => {
      /* istanbul ignore if: As we connect directly to account management db, we ignore test with mongodb. */
      if (!inMemory) {
        return new MongoDbQueryService(
          mongoUri || this._keyVaultConfiguration.mongoPath,
          this._envConfiguration.transactionsMongoDbCollection,
          this._envConfiguration.transactionsMongoDbDatabase,
        );
      }
      return new InMemoryQueryService(inMemoryDb);
    });

    this.bind<WriteService>(PaymentIdentifier.transactionWriteService).toDynamicValue(() => {
      /* istanbul ignore if: As we connect directly to account management db, we ignore test with mongodb. */
      if (!inMemory) {
        return new MongoDbOperationsWriteService(
          mongoUri || this._keyVaultConfiguration.mongoPath,
          this._envConfiguration.transactionsMongoDbCollection,
          this._envConfiguration.transactionsMongoDbDatabase,
          this.get(SymLogger),
        );
      }
      return new InMemoryWriteService(inMemoryDb);
    });

    return this;
  }

  //FIX-IT: Move this into app layer.
  async initSubscribers(): Promise<PaymentKernel> {
    await configureEventHandler(this, em => {
      // @oney/profile -> this._envConfiguration.topicOdbProfileAzf
      // @oney/payment -> this._envConfiguration.serviceBusCardLifecycleFunctionTopic
      // @oney/payment -> this._envConfiguration.serviceBusTopic
      // @oney/profile -> this._envConfiguration.odbProfileTopic
      // @oney/payment -> this._envConfiguration.topicTransaction
      // @oney/payment -> this._envConfiguration.ekycFunctionTopic
      // @oney/payment -> this._envConfiguration.cdpTopic
      em.register(UserKycDecisionUpdated, UserKycDecisionUpdatedEventHandler, {
        topic: this._envConfiguration.topicOdbProfileAzf,
      });
      em.register(CardStatusUpdateReceived, CardStatusUpdateReceivedEventHandler, {
        topic: this._envConfiguration.serviceBusCardLifecycleFunctionTopic,
      });
      em.register(ProfileActivated, ProfileActivatedHandler, {
        topic: this._envConfiguration.odbProfileTopic,
      });
      em.register(RawSmoDebtReceived, RawSmoDebtReceivedHandler, {
        topic: this._envConfiguration.serviceBusTopic,
      });
      em.register(CardTransactionReceived, CardTransactionReceivedEventHandler, {
        topic: this._envConfiguration.topicTransaction,
      });
      em.register(ClearingReceived, ClearingReceivedEventHandler, {
        topic: this._envConfiguration.topicTransaction,
      });
      em.register(SctOutExecuted, SctOutExecutedEventHandler, {
        topic: this._envConfiguration.topicTransaction,
      });
      em.register(PaymentCreated, PaymentCreatedEventHandler, {
        topic: this._envConfiguration.serviceBusTopic,
      });
      em.register(SDDReceived, SDDReceivedEventHandler, { topic: this._envConfiguration.ekycFunctionTopic });
      em.register(COPReceived, COPReceivedEventHandler, { topic: this._envConfiguration.ekycFunctionTopic });
      em.register(ClearingOperationReceived, ClearingOperationReceivedEventHandler, {
        topic: this._envConfiguration.serviceBusTopic,
      });
      em.register(X3X4EligibilityCalculated, SplitPaymentEligibilityCalcultedEventHandler, {
        topic: this._envConfiguration.cdpTopic,
      });
      em.register(OrderCard, OrderCardHandler, {
        topic: this._envConfiguration.subscriptionTopic,
      });
      em.register(SplitPaymentScheduleCreated, SplitPaymentScheduleCreatedEventHandler, {
        topic: this._envConfiguration.odbCreditTopic,
      });
      em.register(SctInReceived, SctInReceivedHandler, {
        topic: this._envConfiguration.topicTransaction,
      });
      em.register(DebtsCollectionOrdered, DebtsCollectionOrderedHandler, {
        topic: this._envConfiguration.serviceBusTopic,
      });

      // limits workflow order
      em.register(AccountEligibilityCalculated, AccountEligibilityCalculatedEventHandler, {
        topic: this._envConfiguration.cdpTopic,
      });
      em.register(ProfileActivated, ProfileActivatedEventHandler, {
        topic: this._envConfiguration.odbProfileTopic,
      });
      em.register(CustomBalanceLimitCalculated, CustomBalanceLimitCalculatedEventHandler, {
        topic: this._envConfiguration.cdpTopic,
      });
      em.register(CustomBalanceLimitCalculated, BalanceLimitUncappedCalculatedEventHandler, {
        topic: this._envConfiguration.cdpTopic,
      });
      em.register(DocumentAdded, TaxNoticeUploadedEventHandler, {
        topic: this._envConfiguration.odbProfileTopic,
      });
      em.register(CheckAggregatedAccountsIncomes, CheckAggregatedAccountsIncomesEventHandler, {
        topic: this._envConfiguration.cdpTopic,
      });
      em.register(AggregatedAccountsIncomesChecked, AggregatedAccountsIncomesCheckedEventHandler, {
        topic: this._envConfiguration.cdpTopic,
      });
      em.register(TaxNoticeAnalysisSucceeded, TaxNoticeAnalysisSucceededEventHandler, {
        topic: this._envConfiguration.odbProfileTopic,
      });
      em.register(TaxNoticeAnalysisRejected, TaxNoticeAnalysisRejectedEventHandler, {
        topic: this._envConfiguration.odbProfileTopic,
      });
      em.register(ClearingBatchReceived, ClearingBatchReceivedEventHandler, {
        topic: this._envConfiguration.ekycFunctionTopic,
      });
    });

    return this;
  }
}
