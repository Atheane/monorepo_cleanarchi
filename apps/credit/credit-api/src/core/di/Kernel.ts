import { configureLogger } from '@oney/logger-adapters';
import { X3X4EligibilityCalculated } from '@oney/cdp-messages';
import { ExpressAuthenticationMiddleware } from '@oney/common-adapters';
import { buildDomainEventDependencies, MessagingPlugin } from '@oney/ddd';
import { configureIdentityLib } from '@oney/identity-adapters';
import { EncodeIdentity, RequestScaVerifier, ServiceName, VerifySca } from '@oney/identity-core';
import { configureEventHandler } from '@oney/messages-adapters';
import { BankAccountCreated } from '@oney/payment-messages';
import { Container } from 'inversify';
import { Connection } from 'mongoose';
import * as mongoose from 'mongoose';
import {
  CreditIdentifiers,
  BankAccountCreatedHandler,
  X3X4EligibilityCalculatedHandler,
  GuardGateway,
  IdGenerator,
  IAppConfiguration,
  SplitContractRepository,
  SplitPaymentScheduleRepository,
  FileStorage,
  PaymentScheduleService,
  PaymentService,
  TermsService,
  CheckUserId,
  CreateCreditor,
  CreateSplitContract,
  CreditGetAllSplitContract,
  GetCreditor,
  GetOneSplitContract,
  GetPaymentSchedule,
  GetSplitContracts,
  GetTerms,
  SimulateSplit,
  UpdateCreditor,
  ValidateSplitSimulation,
} from '@oney/credit-core';
import { DomainDependencies } from './DomainDependencies';
import { InMemoryDependencies } from './InMemoryDependencies';
import { RealDependencies } from './RealDependencies';
import { AzureStorageBlob } from '../adapters/fileStorage';
import { LongUuidGenerator, UserIdGuardGateway } from '../adapters/gateways';
import { PaymentExecutionMapper } from '../adapters/mappers';
import { GetPaymentScheduleService, GetTermsService, OdbPaymentService } from '../adapters/services';

export class Kernel extends Container {
  private readonly appConfiguration: IAppConfiguration;

  constructor(inMemory: boolean, appConfiguration: IAppConfiguration, dbConnection?: mongoose.Connection) {
    super();
    this.appConfiguration = appConfiguration;

    configureLogger(this);

    if (inMemory) {
      InMemoryDependencies.initDependencies(this);
    } else {
      if (!this.isBound(Connection)) {
        this.bind(Connection).toConstantValue(dbConnection);
      }
      RealDependencies.initDependencies(this, appConfiguration, dbConnection);
    }
  }

  private async initIdentityLib(): Promise<void> {
    await configureIdentityLib(this, {
      jwtOptions: {
        ignoreExpiration: false,
      },
      azureTenantId: this.appConfiguration.azureTenantId,
      secret: this.appConfiguration.jwtSignatureKey,
      serviceName: ServiceName.credit,
      frontDoorBaseApiUrl: this.appConfiguration.frontDoorApiBaseUrl,
      azureClientIds: {
        oney_compta: this.appConfiguration.oneyComptaClientId,
        pp_de_reve: null,
      },
      applicationId: this.appConfiguration.applicationId,
    });
    this.bind(ExpressAuthenticationMiddleware).to(ExpressAuthenticationMiddleware);
  }

  public async initDependencies(): Promise<void> {
    await this.initIdentityLib();
    this.initUsecases();
    this.initServices();
    this.initMappers();
    await this.initSubscribers();
    this.initConfigs();
    this.bind<FileStorage>(CreditIdentifiers.fileStorage).toConstantValue(new AzureStorageBlob());
    this.bind<GuardGateway>(CreditIdentifiers.guardGateway).to(UserIdGuardGateway);
    this.bind<IdGenerator>(CreditIdentifiers.longIdGenerator).to(LongUuidGenerator);
    this.bind<EncodeIdentity>(CreditIdentifiers.encodeIdentity).to(EncodeIdentity);
  }

  private initConfigs(): void {
    this.bind<IAppConfiguration>(CreditIdentifiers.configuration).toConstantValue(this.appConfiguration);
  }

  private initUsecases(): void {
    this.bind<CheckUserId>(CheckUserId).to(CheckUserId);
    this.bind(GetPaymentSchedule).to(GetPaymentSchedule);
    this.bind<GetTerms>(GetTerms).to(GetTerms);
    this.bind<SimulateSplit>(SimulateSplit).to(SimulateSplit);
    this.bind<ValidateSplitSimulation>(ValidateSplitSimulation).to(ValidateSplitSimulation);
    this.bind(CreateSplitContract).to(CreateSplitContract);
    this.bind<GetOneSplitContract>(GetOneSplitContract).to(GetOneSplitContract);
    this.bind<GetSplitContracts>(GetSplitContracts).to(GetSplitContracts);
    this.bind<CreditGetAllSplitContract>(CreditGetAllSplitContract).to(CreditGetAllSplitContract);
    this.bind<CreateCreditor>(CreateCreditor).to(CreateCreditor);
    this.bind<UpdateCreditor>(UpdateCreditor).to(UpdateCreditor);
    this.bind<GetCreditor>(GetCreditor).to(GetCreditor);
  }

  private initServices(): void {
    this.bind<TermsService>(CreditIdentifiers.termsService).to(GetTermsService);
    this.bind<PaymentService>(CreditIdentifiers.paymentService).to(OdbPaymentService);
  }

  private initMappers(): void {
    this.bind<PaymentExecutionMapper>(CreditIdentifiers.mappers.paymentExecutionMapper).to(
      PaymentExecutionMapper,
    );
    this.bind<PaymentScheduleService>(CreditIdentifiers.paymentScheduleService).to(GetPaymentScheduleService);
  }

  async initSubscribers(): Promise<void> {
    await configureEventHandler(this, em => {
      // @oney/payment -> this.appConfiguration.odbPaymentConfiguration.topic,
      // @oney/cdp -> this.appConfiguration.eligibilityConfiguration.topic
      em.register(BankAccountCreated, BankAccountCreatedHandler, {
        topic: this.appConfiguration.odbPaymentConfiguration.topic,
      });
      em.register(X3X4EligibilityCalculated, X3X4EligibilityCalculatedHandler, {
        topic: this.appConfiguration.eligibilityConfiguration.topic,
      });
    });
  }

  getDependencies(): DomainDependencies {
    return {
      configuration: this.get<IAppConfiguration>(CreditIdentifiers.configuration),
      getTerms: this.get(GetTerms),
      simulateSplit: this.get(SimulateSplit),
      validateSplitSimulation: this.get(ValidateSplitSimulation),
      createSplitContract: this.get(CreateSplitContract),
      getOneSplitContract: this.get(GetOneSplitContract),
      getSplitContracts: this.get(GetSplitContracts),
      creditGetAllSplitContract: this.get(CreditGetAllSplitContract),
      checkUserId: this.get(CheckUserId),
      longIdGenerator: this.get<IdGenerator>(CreditIdentifiers.longIdGenerator),
      splitPaymentScheduleRepository: this.get<SplitPaymentScheduleRepository>(
        CreditIdentifiers.splitPaymentScheduleRepository,
      ),
      splitContractRepository: this.get<SplitContractRepository>(CreditIdentifiers.splitContractRepository),
      getPaymentSchedule: this.get(GetPaymentSchedule),
      encodeIdentity: this.get(EncodeIdentity),
      expressAuthenticationMiddleware: this.get(ExpressAuthenticationMiddleware),
      verifySca: this.get(VerifySca),
      requestSca: this.get(RequestScaVerifier),
      createCreditor: this.get(CreateCreditor),
      updateCreditor: this.get(UpdateCreditor),
      getCreditor: this.get(GetCreditor),
    };
  }

  useServiceBus(messagingPlugin: MessagingPlugin): Kernel {
    buildDomainEventDependencies(this).usePlugin(messagingPlugin);
    return this;
  }
}
