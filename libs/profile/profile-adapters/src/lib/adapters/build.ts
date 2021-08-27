import {
  AzureServiceBus,
  configureInMemoryEventHandlerExecution,
  configureMongoEventHandlerExecution,
  createAzureConnection,
} from '@oney/az-servicebus-adapters';
import { configureLogger } from '@oney/logger-adapters';
import { configureAzureCommandServiceBus } from '@oney/messages-adapters';
import {
  EventHandlerExecutionFinder,
  EventHandlerExecutionStore,
  EventProducerDispatcher,
} from '@oney/messages-core';
import { initRxMessagingPlugin } from '@oney/rx-events-adapters';
import { Container, interfaces } from 'inversify';
import { SymLogger } from '@oney/logger-core';
import {
  buildCoreModules,
  InMemoryQueryService,
  InMemoryWriteService,
  MongoDbQueryService,
  MongoDbWriteService,
  ServiceApiProvider,
} from '@oney/common-adapters';
import {
  ActivateProfileWithAggregation,
  AddressStep,
  B2BCustomerGateway,
  BankAccountGateway,
  CivilStatus,
  CompleteDiligence,
  ContractDocumentGateway,
  ContractGateway,
  CreateProfile,
  CustomerGateway,
  DbConfig,
  DbServices,
  DocumentsReferentialGateway,
  FacematchGateway,
  FicpGateway,
  FiscalStatusStep,
  FolderGateway,
  GenerateOtpStep,
  GetContract,
  GetCustomerServiceTopics,
  GetCustomerSituations,
  GetFicpFcc,
  GetFiscalCountriesList,
  GetKycDocuments,
  GetProfessionalActivitiesList,
  GetTips,
  GetUserInfos,
  Identifiers,
  KycGateway,
  OtpGateway,
  OtpRepositoryRead,
  OtpRepositoryWrite,
  ProfileCoreConfiguration,
  ProfileRepositoryRead,
  ProfileRepositoryWrite,
  ProvidersConfig,
  SendDemandToCustomerService,
  SignContract,
  StorageGateway,
  TipsRepositoryRead,
  TipsService,
  TipsServiceProviders,
  UpdateConsents,
  UpdateProfileEligibility,
  UpdateProfileLcbFt,
  UpdateProfileScoring,
  UpdateProfileStatus,
  UploadIdentityDocument,
  UploadTaxNotice,
  UserGateway,
  ValidateFacematch,
  ValidatePhoneStep,
  ValidateSubscriptionStep,
  VerifyBankAccountOwner,
} from '@oney/profile-core';
import { AxiosHttpMethod, httpBuilder } from '@oney/http';
import { buildDomainEventDependencies } from '@oney/ddd';
import {
  configureIdentityLib,
  getServiceHolderIdentity,
  IdentityConfiguration,
} from '@oney/identity-adapters';
import { ServiceName } from '@oney/identity-core';
import { IdGenerator } from '@oney/payment-core';
import { Collection, Connection, createConnection } from 'mongoose';
import { BlobServiceClient } from '@azure/storage-blob';
import { DocumentGenerator } from '@oney/document-generator';
import { OneyFicpGateway } from '@oney/profile-adapters';
import { CdpTipsMapper } from './mappers/CdpTipsMapper';
import { ProfileEventProducerDispatcher } from './services/LegacyEventDispatcher/ProfileEventDispatcher';
import { OdbTipsService } from './services/OdbTipsService';
import { ProfileMapper } from './mappers/ProfileMapper';
import { CdpApiProvider } from './providers/cdp/CdpApiProvider';
import { CdpTipsRepository } from './repositories/tips/CdpTipsRepository';
import { OdbProfileRepositoryRead } from './repositories/profile/OdbProfileRepositoryRead';
import { OdbTipsRepository } from './repositories/tips/OdbTipsRepository';
import { OdbProfileRepositoryWrite } from './repositories/profile/OdbProfileRepositoryWrite';
import { OneytrustApiProvider } from './providers/oneytrust/OneytrustApiProvider';
import { OneytrustFacematchGateway } from './gateways/OneytrustFacematchGateway';
import { OneyB2CCustomerMapper } from './mappers/OneyB2CCustomerMapper';
import { OneyB2CCustomerGateway } from './gateways/OneyB2CCustomerGateway';
import { OneyB2CApiProvider } from './providers/oneyB2C/OneyB2CApiProvider';
import { OdbPaymentApiProvider } from './providers/odb/payment/OdbPaymentApiProvider';
import { OneyTrustFolderGateway } from './gateways/OneyTrustFolderGateway';
import { OdbUserUpdateMapper } from './mappers/OdbUserUpdateMapper';
import { OdbUserGateway } from './gateways/OdbUserGateway';
import { OdbBankAccountGateway } from './gateways/OdbBankAccountGateway';
import { ShortIdGenerator } from './gateways/ShortIdGenerator';
import { OdbOtpRepositoryRead } from './repositories/otp/OdbOtpRepositoryRead';
import { OdbOtpRepositoryWrite } from './repositories/otp/OdbOtpRepositoryWrite';
import { OtpMapper } from './mappers/OtpMapper';
import { OdbOtpGateway } from './gateways/OdbOtpGateway';
import { BlobStorageGateway } from './gateways/BlobStorageGateway';
import { OneyTrustKycDocumentGateway } from './gateways/OneyTrustKycDocumentGateway';
import { OneyB2BContractGateway } from './gateways/OneyB2BContractGateway';
import { OneyB2BApiProvider } from './providers/OneyB2B/OneyB2BApiProvider';
import { OneyB2BCustomerGateway } from './gateways/OneyB2BCustomerGateway';
import { OneyB2BCustomerResponseMapper } from './mappers/OneyB2BCustomerResponseMapper';
import { OdbContractDocumentGateway } from './gateways/OdbContractDocumentGateway';
import { OneyB2CCreateProfileGateway } from './gateways/OneyB2CCreateProfileGateway';
import { buildCdpEventHandlers } from './events/cdp/index';
import { buildPaymentEventHandlers } from './events/payment/index';
import { buildAggregationEventHandlers } from './events/aggregation/index';
import {
  RequestInterceptor,
  ResponseInterceptor,
} from './services/interceptorClientHttp/interceptorOneyFccFicpClient';
import { OneyFicpApiProvider } from './providers/OneyFicp/OneyFicpApiProvider';
import { OneyFicpMapper } from './mappers/OneyFicpMapper';
import { buildOneyTrustEventHandlers } from './events/oneytrust/index';
import { OneyTrustDataRecoveryGateway } from './gateways/OneyTrustDataRecoveryGateway';
import { buildProfileHandlers } from './events/profile';
import { OneyFccApiProvider } from './providers/oneyFcc/OneyFccApiProvider';
import { OneyFccGateway } from './gateways/OneyFccGateway';
import { OneyFccMapper } from './mappers/OneyFccMapper';
import { KycDocumentsReferentialGateway } from './gateways/KycDocumentsReferentialGateway';
import { buildSagaCommandsHandlers } from './commands/saga/build';
import { buildProfileSaga } from './saga/index';
import { ContractDocumentRequestMapper } from './mappers/ContractDocumentRequestMapper';

export function configureStorage(azureBlobConnectionString: string, azureBlobContainerName: string) {
  const blobServiceClient = BlobServiceClient.fromConnectionString(azureBlobConnectionString);
  const blobContainerClient = blobServiceClient.getContainerClient(azureBlobContainerName);
  return { blobServiceClient, blobContainerClient };
}

export function configureHttpApiClient(config: ProvidersConfig) {
  return {
    cdpClient: httpBuilder(new AxiosHttpMethod())
      .setBaseUrl(config.cdpConfig.baseUrl)
      .setDefaultHeaders({
        'Ocp-Apim-Subscription-Key': config.cdpConfig.authToken,
      })
      .setResponseTimeout(config.cdpConfig.timeout),
    oneytrustClient: httpBuilder(new AxiosHttpMethod()).setBaseUrl(config.oneytrustConfig.otBaseUrl),
    oneyCrmClient: httpBuilder(new AxiosHttpMethod())
      .setBaseUrl(config.oneyB2CConfig.baseUrl)
      .setDefaultHeaders({
        'X-Oney-Language-Code': 'fr',
        'X-Oney-Partner-Country-Code': 'FR',
        'Content-Type': 'application/json',
        'X-Oney-Authorization': config.oneyB2CConfig.OdbOneyB2CApiXAuthAuthent,
        'X-Oney-Media-Code': 'Application_Mobile',
        'X-Oney-User-Type': 'Client',
        'client-id': config.oneyB2CConfig.odbOneyB2CApiClientId,
      })
      .setMaxRetries(3)
      .circuitDuration(5000)
      .configureRetry({
        retryDelay: 3000,
        shouldResetTimeOut: false,
        useExponentialRetryDelay: true,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        retryCondition: error => {
          return false;
        },
      }),
    oneyB2BClient: httpBuilder(new AxiosHttpMethod())
      .setDefaultHeaders({
        'Content-Type': 'Application/json',
        appCaller: 'EXT_BQ_DIGIT',
        'X-Oney-Partner-Country-Code': 'FR',
        'X-Oney-Authorization': config.oneyB2CConfig.OdbOneyB2CApiXAuthAuthent,
      })
      .setBaseUrl(config.oneyB2CConfig.baseUrl)
      .setMaxRetries(3)
      .circuitDuration(5000)
      .configureRetry({
        retryDelay: 3000,
        useExponentialRetryDelay: true,
        shouldResetTimeOut: true,
        retryCondition: () => false,
      }),
    oneyFccFicpCypherDecipherClient: httpBuilder(new AxiosHttpMethod())
      .setDefaultHeaders({
        'Content-Type': 'Application/json',
        appCaller: 'EXT_BQ_DIGIT',
        'X-Oney-Authorization': config.oneyFccFicp.oneyFccFicpApiXAuthAuthent,
        'X-Oney-Partner-Country-Code': 'FR',
      })
      .setBaseUrl(config.oneyFccFicp.baseUrl)
      .setRequestInterceptor(new RequestInterceptor(config.oneyFccFicp.secretKey))
      .setResponseInterceptor(new ResponseInterceptor(config.oneyFccFicp.secretKey)),
    oneyFccFicpClient: httpBuilder(new AxiosHttpMethod())
      .setDefaultHeaders({
        'Content-Type': 'Application/json',
        appCaller: 'EXT_BQ_DIGIT',
        'X-Oney-Authorization': config.oneyFccFicp.oneyFccFicpApiXAuthAuthent,
        'X-Oney-Partner-Country-Code': 'FR',
      })
      .setBaseUrl(config.oneyFccFicp.baseUrl),
  };
}

// Create new write and query services when needed
export async function configureDbServices(useInMemory: boolean, config?: DbConfig): Promise<DbServices> {
  const inMemoryDb: Map<string, any> = new Map<string, any>();
  let collection: Collection;

  // istanbul ignore next - Will be tested by integration test
  if (!useInMemory) {
    const connection = await createConnection(config.dbMongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    collection = connection.collection(config.dbMongoCollection);
    return {
      dbReadService: new MongoDbQueryService(collection),
      dbWriteService: new MongoDbWriteService(collection),
    };
  }

  return {
    dbReadService: new InMemoryQueryService(inMemoryDb),
    dbWriteService: new InMemoryWriteService(inMemoryDb),
  };
}

export async function configureServiceProvider(
  container: Container,
  identityConfig: IdentityConfiguration,
  frontDoorBaseUrl: string,
) {
  await configureIdentityLib(container, identityConfig);
  const authKey = await getServiceHolderIdentity(container, ServiceName.profile);
  const httpClient = httpBuilder(new AxiosHttpMethod())
    .setBaseUrl(frontDoorBaseUrl)
    .setDefaultHeaders({
      Authorization: `Bearer ${authKey}`,
    });
  const serviceProvider = new ServiceApiProvider(httpClient, 'SERVICE_API_ERROR');
  container
    .bind<BankAccountGateway>(Identifiers.bankAccountGateway)
    .toConstantValue(new OdbBankAccountGateway(serviceProvider));
}

export async function buildProfileAdapterLib(
  container: Container,
  config: ProfileCoreConfiguration,
  identityConfig: IdentityConfiguration,
) {
  configureLogger(container);

  await buildCoreModules(container, config.inMemoryMode, {
    mongodb: {
      url: config.mongoUrl,
      collection: config.mongoCollection,
    },
  });
  const cdpProvider = new CdpApiProvider(
    configureHttpApiClient(config.providersConfig).cdpClient,
    'CDP_API_ERROR',
  );
  const odbPaymentProvider = new OdbPaymentApiProvider(
    httpBuilder(new AxiosHttpMethod())
      .setBaseUrl(config.providersConfig.odbPaymentConfig.baseUrl)
      .setDefaultHeaders({
        Authorization: Buffer.from(config.providersConfig.odbPaymentConfig.token, 'base64').toString('utf-8'),
      }),
    'ODB_PAYMENT_API_ERROR',
  );
  const oneytrustProvider = new OneytrustApiProvider(
    configureHttpApiClient(config.providersConfig).oneytrustClient,
    'ONEYTRUST_API_ERROR',
    {
      secretKey: config.providersConfig.oneytrustConfig.secretKey,
      entityReference: config.providersConfig.oneytrustConfig.entityReference,
      login: config.providersConfig.oneytrustConfig.login,
      oneyTrustFolderBaseApi: config.providersConfig.oneytrustConfig.oneyTrustFolderBaseApi,
    },
  );

  const otpDbProvider = await configureDbServices(config.inMemoryMode, config.otpDbConfig);

  const oneyCrmApiProvider = new OneyB2CApiProvider(
    configureHttpApiClient(config.providersConfig).oneyCrmClient,
    {
      apiVersion: config.providersConfig.oneyB2CConfig.apiVersion,
      odbOneyB2CKeyId: config.providersConfig.oneyB2CConfig.odbOneyB2CKeyId,
      odbOneyB2CKey: config.providersConfig.oneyB2CConfig.odbOneyB2CKey,
      odbOneyB2CApiClientId: config.providersConfig.oneyB2CConfig.odbOneyB2CApiClientId,
      tokenExpiration: config.providersConfig.oneyB2CConfig.tokenExpiration,
      odbOneyB2CApiClientSecret: config.providersConfig.oneyB2CConfig.odbOneyB2CApiClientSecret,
      OdbOneyB2CApiXAuthAuthor: config.providersConfig.oneyB2CConfig.OdbOneyB2CApiXAuthAuthor,
      OdbOneyB2CApiXAuthAuthent: config.providersConfig.oneyB2CConfig.OdbOneyB2CApiXAuthAuthent,
    },
  );

  const oneyB2BApiProvider = new OneyB2BApiProvider(
    configureHttpApiClient(config.providersConfig).oneyB2BClient,
    'ONEY_B2B_API_ERROR',
  );

  const oneyFicpApiProvier = new OneyFicpApiProvider(
    configureHttpApiClient(config.providersConfig).oneyFccFicpClient,
    configureHttpApiClient(config.providersConfig).oneyFccFicpCypherDecipherClient,
  );

  const oneyFccApiProvider = new OneyFccApiProvider(
    configureHttpApiClient(config.providersConfig).oneyFccFicpClient,
    configureHttpApiClient(config.providersConfig).oneyFccFicpCypherDecipherClient,
  );

  const { blobContainerClient } = configureStorage(
    config.odbProfileBlobStorageCs,
    config.blobStorageContainerName,
  );

  container.bind(OneyFccMapper).toSelf();
  container.bind(OneyFicpMapper).toSelf();
  container.bind(OneyB2BCustomerResponseMapper).toSelf();
  container.bind(ProfileMapper).toSelf();
  container.bind(CdpTipsMapper).toSelf();
  container.bind(OneyB2CCustomerMapper).toSelf();
  container.bind(OdbUserUpdateMapper).toSelf();
  container.bind(UpdateConsents).toSelf();
  container.bind<ProfileRepositoryWrite>(Identifiers.profileRepositoryWrite).to(OdbProfileRepositoryWrite);
  container.bind<ProfileRepositoryRead>(Identifiers.profileRepositoryRead).to(OdbProfileRepositoryRead);
  container
    .bind<TipsRepositoryRead>(Identifiers.tipsRepositoryRead)
    .toConstantValue(new CdpTipsRepository(cdpProvider, new CdpTipsMapper()))
    .whenParentNamed(TipsServiceProviders.cdp);
  container
    .bind<TipsRepositoryRead>(Identifiers.tipsRepositoryRead)
    .to(OdbTipsRepository)
    .whenParentNamed(TipsServiceProviders.odb);

  container.bind<TipsService>(Identifiers.tipsProvider).to(OdbTipsService);
  container
    .bind<CustomerGateway>(Identifiers.customerGateway)
    .toConstantValue(new OneyB2CCustomerGateway(oneyCrmApiProvider, container.get(OneyB2CCustomerMapper)));
  container
    .bind(Identifiers.digitalIdentityGateway)
    .toConstantValue(new OneyB2CCreateProfileGateway(oneyCrmApiProvider));
  container
    .bind<ContractGateway>(Identifiers.contractGateway)
    .toConstantValue(new OneyB2BContractGateway(oneyB2BApiProvider));
  container
    .bind<B2BCustomerGateway>(Identifiers.b2bCustomerGateway)
    .toConstantValue(
      new OneyB2BCustomerGateway(oneyB2BApiProvider, container.get(OneyB2BCustomerResponseMapper)),
    );

  container
    .bind<FicpGateway>(Identifiers.ficpGateway)
    .toConstantValue(
      new OneyFicpGateway(
        oneyFicpApiProvier,
        container.get(OneyFicpMapper),
        config.providersConfig.oneyFccFicp.partnerGuid,
      ),
    );

  container
    .bind<UserGateway>(Identifiers.userGateway)
    .toConstantValue(new OdbUserGateway(odbPaymentProvider, container.get(OdbUserUpdateMapper)));
  container
    .bind<interfaces.Factory<TipsService>>('Factory<TipsService>')
    .toFactory<TipsService>((context: interfaces.Context) => {
      return (named: string) => {
        return context.container.getNamed<TipsService>(Identifiers.tipsProvider, named);
      };
    });

  container
    .bind<FacematchGateway>(Identifiers.facematchGateway)
    .toConstantValue(new OneytrustFacematchGateway(oneytrustProvider));
  container
    .bind<FolderGateway>(Identifiers.folderGateway)
    .toConstantValue(
      new OneyTrustFolderGateway(
        oneytrustProvider,
        config.providersConfig.oneytrustConfig.entityReference,
        config.providersConfig.oneytrustConfig.caseType,
        config.providersConfig.oneytrustConfig.language,
        config.providersConfig.oneytrustConfig.flagCallbackUrlInPayload,
        config.providersConfig.oneytrustConfig.callbackDecisionUrl,
      ),
    );

  container
    .bind<OtpRepositoryRead>(Identifiers.otpRepositoryRead)
    .toConstantValue(new OdbOtpRepositoryRead(otpDbProvider.dbReadService, new OtpMapper()));
  container
    .bind<OtpRepositoryWrite>(Identifiers.otpRepositoryWrite)
    .toConstantValue(new OdbOtpRepositoryWrite(otpDbProvider.dbWriteService, new OtpMapper()));
  container.bind<IdGenerator>(Identifiers.idGenerator).to(ShortIdGenerator);
  container
    .bind<OtpGateway>(Identifiers.otpGateway)
    .toConstantValue(
      new OdbOtpGateway(
        config.otpExpirationTime,
        config.activateGenericOtp,
        config.otpMaxAttempts,
        config.otpLockDuration,
      ),
    );
  container
    .bind<boolean>(Identifiers.featureFlagContract)
    .toConstantValue(config.providersConfig.oneyB2CConfig.featureFlagContract);
  container
    .bind<boolean>(Identifiers.featureFlagProfileStatusSaga)
    .toConstantValue(config.featureFlag.profileStatusSaga);

  container.bind(GetContract).toSelf();
  container.bind<GetCustomerSituations>(Identifiers.getCustomerSituations).to(GetCustomerSituations);
  container.bind(GetUserInfos).to(GetUserInfos);
  container.bind(GetTips).to(GetTips);
  container.bind(ValidateFacematch).to(ValidateFacematch);
  container.bind(CompleteDiligence).to(CompleteDiligence);
  container.bind(CivilStatus).to(CivilStatus);
  container.bind(AddressStep).to(AddressStep);
  container.bind(GetFiscalCountriesList).to(GetFiscalCountriesList);
  container.bind(GetProfessionalActivitiesList).to(GetProfessionalActivitiesList);
  container.bind(UpdateProfileLcbFt).to(UpdateProfileLcbFt);
  container.bind(ActivateProfileWithAggregation).to(ActivateProfileWithAggregation);
  container.bind(VerifyBankAccountOwner).to(VerifyBankAccountOwner);
  container.bind(UploadIdentityDocument).toSelf();
  container.bind(UploadTaxNotice).toSelf();
  container.bind(CreateProfile).to(CreateProfile);
  container.bind(ValidateSubscriptionStep).to(ValidateSubscriptionStep);
  container.bind(GetKycDocuments).toSelf();
  container
    .bind<DocumentsReferentialGateway>(Identifiers.documentsReferentialGateway)
    .to(KycDocumentsReferentialGateway);
  container
    .bind<KycGateway>(Identifiers.kycGateway)
    .toConstantValue(
      new OneyTrustKycDocumentGateway(
        oneytrustProvider,
        config.providersConfig.oneytrustConfig.login,
        new KycDocumentsReferentialGateway(),
      ),
    );
  container
    .bind<StorageGateway>(Identifiers.storageGateway)
    .toConstantValue(new BlobStorageGateway(blobContainerClient));

  container.bind(FiscalStatusStep).to(FiscalStatusStep);
  container.bind(ValidatePhoneStep).to(ValidatePhoneStep);
  container.bind(SignContract).to(SignContract);
  container
    .bind<ContractDocumentGateway>(Identifiers.contractDocumentGateway)
    .toDynamicValue(
      () =>
        new OdbContractDocumentGateway(
          config,
          new DocumentGenerator(config.documentGeneratorApiUrl),
          container.get(Identifiers.storageGateway),
          new ContractDocumentRequestMapper(),
        ),
    );
  container.bind(Identifiers.updateProfileEligibility).to(UpdateProfileEligibility);
  container.bind(UpdateProfileEligibility).toSelf();
  container.bind(GetFicpFcc).toSelf();
  container.bind(SendDemandToCustomerService).toSelf();
  container
    .bind(GetCustomerServiceTopics)
    .toConstantValue(new GetCustomerServiceTopics(new BlobStorageGateway(blobContainerClient), config));
  container.bind(UpdateProfileScoring).toSelf();
  container.bind(GenerateOtpStep).toSelf();
  container.bind(Identifiers.updateProfileStatus).to(UpdateProfileStatus);

  container
    .bind(Identifiers.scoringDataRecoveryGateway)
    .toConstantValue(new OneyTrustDataRecoveryGateway(oneytrustProvider));

  container
    .bind(Identifiers.fccGateway)
    .toConstantValue(
      new OneyFccGateway(
        oneyFccApiProvider,
        new OneyFccMapper(),
        config.providersConfig.oneyFccFicp.partnerGuid,
      ),
    );

  if (config.inMemoryMode && !config.forceAzureServiceBus) {
    configureInMemoryEventHandlerExecution(container);
    buildDomainEventDependencies(container).usePlugin(initRxMessagingPlugin());
  } else {
    const connection = await createConnection(config.mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    if (!container.isBound(Connection)) {
      container.bind(Connection).toConstantValue(connection);
    }

    configureMongoEventHandlerExecution(container);

    buildDomainEventDependencies(container).usePlugin(
      createAzureConnection(
        config.serviceBusUrl,
        config.serviceBusSub,
        config.serviceBusTopic,
        container.get(SymLogger),
        container.get(EventHandlerExecutionFinder),
        container.get(EventHandlerExecutionStore),
      ),
    );
  }

  await configureAzureCommandServiceBus(
    container,
    {
      connectionString: config.serviceBusUrl,
    },
    () => {
      //nothing
    },
  );

  await configureServiceProvider(container, identityConfig, config.frontDoorApiBaseUrl);

  // replace EventProducerDispatcher
  const profileEventProducer = new ProfileEventProducerDispatcher(
    container.get(EventProducerDispatcher),
    new AzureServiceBus(config.serviceBusUrl, '', container.get(SymLogger)),
    container.get(ProfileMapper),
  );

  container.rebind(EventProducerDispatcher).toConstantValue(profileEventProducer);

  //Event handlers
  await buildAggregationEventHandlers(container, config);
  await buildPaymentEventHandlers(container, config);
  await buildCdpEventHandlers(container, config);
  await buildOneyTrustEventHandlers(container, config);
  await buildProfileHandlers(container, {
    odbProfileTopic: config.serviceBusTopic,
  });

  //Command Handlers
  await buildSagaCommandsHandlers(container, config);

  //Saga
  if (config.featureFlag.profileStatusSaga) {
    await buildProfileSaga(container);
  }
}
