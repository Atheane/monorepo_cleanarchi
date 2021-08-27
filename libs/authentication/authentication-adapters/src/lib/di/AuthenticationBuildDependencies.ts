import { configureLogger } from '@oney/logger-adapters';
import { SymLogger } from '@oney/logger-core';
import { Container } from 'inversify';
import { connect, connection, Connection } from 'mongoose';
import { DOMParser } from 'xmldom';
import { ServiceBusClient } from '@azure/service-bus';
import { ServiceApiProvider } from '@oney/common-adapters';
import { AxiosHttpMethod, httpBuilder } from '@oney/http';
import {
  AuthenticationGateway,
  AuthIdentifier,
  AuthRequestGenerator,
  AuthRequestHandler,
  AuthRequestPayload,
  AuthValidationResonseHandler,
  BusDelivery,
  ChannelGateway,
  CleanPinCode,
  ConsumeVerifier,
  SignUpUser,
  DomainDependencies,
  EncryptionGateway,
  GeneratedEchoRequest,
  GeneratedProvisionRequest,
  GetProfileInformationGateway,
  GetUser,
  HashGateway,
  IdentityEncoder,
  IdentityEncodingService,
  IdGenerator,
  InvitationGateway,
  InvitationRepository,
  OneyTokenKeys,
  OtpGenerator,
  PingAuth,
  PingRefAuth,
  ProfileGateway,
  ProvisioningFunctionalErrorFactory,
  ProvisionUserCard,
  ProvisionUserPhone,
  PublicKeyGateway,
  RedirectHandler,
  RegisterCreate,
  RegisterValidate,
  RequestSca,
  RequestVerifier,
  RetryStrategyGenerator,
  ScaVerifierGateway,
  SetPinCode,
  SignatureGateway,
  SignIn,
  UserData,
  UserRepository,
  UserUid,
  VerifierGenerator,
  VerifierRepository,
  VerifyCredentials,
  CardGateway,
  PhoneProvisioningGateway,
  CardProvisioningGateway,
  ProvisionUserPassword,
  BlockUser,
  AuthVerificationGateway,
} from '@oney/authentication-core';
import { buildDomainEventDependencies, MessagingPlugin } from '@oney/ddd';
import { EventDispatcher, EventProducerDispatcher } from '@oney/messages-core';
import { VerifierBase } from '../adapters/decorators/verifiers';
import { OdbEncryptionGateway } from '../adapters/gateways/OdbEncryptionGateway';
import { OtpCodeGenerator } from '../adapters/gateways/OtpCodeGenerator';
import { UuidGenerator } from '../adapters/gateways/UuidGenerator';
import { OdbAuthenticationGateway } from '../adapters/gateways/auth/OdbAuthenticationGateway';
import { AzureBusDelivery } from '../adapters/gateways/bus/AzureBusDelivery';
import { ChannelHandlerGateway } from '../adapters/gateways/channels/ChannelHandlerGateway';
import { RsaPublicKeyGateway } from '../adapters/gateways/crypto/RsaPublicKeyGateway';
import { IcgRetryStrategyGenerator } from '../adapters/gateways/icg/IcgRetryStrategyGenerator';
import { IcgStrongAuthRequestGenerator } from '../adapters/gateways/icg/IcgStrongAuthRequestGenerator';
import { IcgVerifierGenerator } from '../adapters/gateways/icg/IcgVerifierGenerator';
import { OdbSignatureGateway } from '../adapters/gateways/icg/OdbSignatureGateway';
import { IcgRefAuthConsultRequestGenerator } from '../adapters/gateways/icg/refauth/IcgRefAuthConsultRequestGenerator';
import { IcgRefAuthEchoRequestGenerator } from '../adapters/gateways/icg/refauth/IcgRefAuthEchoRequestGenerator';
import { ProvisioningRequestGenerator } from '../adapters/gateways/icg/refauth/ProvisioningRequestGenerator';
import { IcgRefAuthSoapRequestHandler } from '../adapters/gateways/icg/refauth/IcgRefAuthSoapRequestHandler';
import { OdbHashGateway } from '../adapters/gateways/identity/encryption/OdbHashGateway';
import { AuthToken } from '../adapters/gateways/identity/jwt/AuthToken';
import { JwtTokenHandlers } from '../adapters/gateways/identity/jwt/JwtTokenHandlers';
import { ScaToken } from '../adapters/gateways/identity/jwt/ScaToken';
import { SendInvitationGateway } from '../adapters/gateways/invitation/SendInvitationGateway';
import { UserProfileGateway } from '../adapters/gateways/user/UserProfileGateway';
import { VerifierHandler } from '../adapters/gateways/verifiers/VerifierHandler';
import { IcgAuthValidationResponseHandler } from '../adapters/handlers/IcgAuthValidationResponseHandler';
import { IcgRedirectHandler } from '../adapters/handlers/IcgRedirectHandler';
import { InMemoryInvitationRepository } from '../adapters/inmemory/repositories/InMemoryInvitationRepository';
import { InMemoryUserRepository } from '../adapters/inmemory/repositories/InMemoryUserRepository';
import { InMemoryVerifierRepository } from '../adapters/inmemory/repositories/InMemoryVerifierRepository';
import { RestrictedVerifierMapper } from '../adapters/mappers/RestrictedVerifierMapper';
import { InvitationMapper } from '../adapters/mappers/jwt/InvitationMapper';
import { DomainConfiguration } from '../adapters/models/DomainConfiguration';
import { MongodbInvitationRepository } from '../adapters/mongodb/repositories/MongodbInvitationRepository';
import { MongodbUserRepository } from '../adapters/mongodb/repositories/MongodbUserRepository';
import { MongodbVerifierRepository } from '../adapters/mongodb/repositories/MongodbVerifierRepository';
import { OdbGetProfileInformationGateway } from '../adapters/gateways/OdbGetProfileInformationGateway';
import { PhoneStepValidatedEventHandler } from '../adapters/events/handler/PhoneStepValidatedEventHandler';
import { CardSentEventHandler } from '../adapters/events/handler/CardSentEventHandler';
import { UserMapper } from '../adapters/mappers/user/UserMapper';
import { IcgProvisioningFunctionalErrorFactory } from '../adapters/factories/IcgProvisioningFunctionalErrorFactory';
import { InMemoryStorage } from '../adapters/inmemory/types/InMemoryStorage';
import { InMemoryDependencies } from '../adapters/inmemory/types/InMemoryDependencies';
import { UserCardGateway } from '../adapters/gateways/icg/refauth/UserCardGateway';
import { StrongAuthRequestGenerator } from '../adapters/types/sca/StrongAuthRequestGenerator';
import { AuthInitResultMapper } from '../adapters/mappers/icg/AuthInitResultMapper';
import { SamlResponse } from '../adapters/types/icg/SamlResponse';
import { AuthInitSession } from '../adapters/types/icg/AuthInitSession';
import { IcgProvisioningGateway } from '../adapters/gateways/icg/refauth/IcgProvisioningGateway';
import { SamlVerificationGateway } from '../adapters/gateways/icg/auth/SamlVerificationGateway';

export type BuildDependencies = Pick<
  DomainDependencies,
  'userRepository' | 'verifierRepository' | 'invitationRepository'
>;

type StorageDependencies = {
  inMemory: InMemoryDependencies;
  mongoDb: (dbUrl: string, dbName: string) => Promise<AuthenticationBuildDependencies>;
};

export class AuthenticationBuildDependencies extends Container {
  constructor(private readonly domainConfiguration: DomainConfiguration) {
    super();
    configureLogger(this);
  }

  public bindDependencies(authAccessServiceKey: string): AuthenticationBuildDependencies {
    const serviceApiProvider = new ServiceApiProvider(
      httpBuilder(new AxiosHttpMethod())
        .setBaseUrl(`${this.domainConfiguration.frontDoorApiBaseUrl}`)
        .setDefaultHeaders({
          Authorization: `Bearer ${authAccessServiceKey}`,
        }),
      'SERVICE_API_ERROR',
    );
    // this.bind<GetProfileInformationGateway>(AuthIdentifier.getProfileInformationGateway).toConstantValue(
    //   new OdbGetProfileInformationGateway(serviceApiProvider),
    // );

    const { jwt } = this.domainConfiguration;
    const icgStrongAuthRequestGenerator = new IcgStrongAuthRequestGenerator(
      new OdbSignatureGateway({
        signSelfCertificate: this.domainConfiguration.secretService.odbSignCert,
        signSelfPassPhrase: this.domainConfiguration.secretService.odbSignCertPass,
      }),
      this.domainConfiguration,
    );
    const encryptionGateway = new OdbEncryptionGateway(this.domainConfiguration);
    this.bind<EncryptionGateway>(AuthIdentifier.encryptionGateway).toConstantValue(encryptionGateway);
    this.bind<boolean>(AuthIdentifier.useIcgSmsAuthFactor).toConstantValue(
      this.domainConfiguration.useIcgSmsAuthFactor,
    );
    const domParser = new DOMParser();
    this.bind<PublicKeyGateway>(AuthIdentifier.publicKeyGateway).toConstantValue(
      new RsaPublicKeyGateway(this.domainConfiguration),
    );
    this.bind(AuthInitResultMapper).to(AuthInitResultMapper);
    this.bind<ScaVerifierGateway>(AuthIdentifier.verifierService).toConstantValue(
      new VerifierHandler(
        this.get(AuthIdentifier.userRepository),
        this,
        this.domainConfiguration.useIcgSmsAuthFactor,
      ),
    );
    this.bind<IdGenerator>(AuthIdentifier.idGenerator).to(UuidGenerator);
    this.bind<OtpGenerator>(AuthIdentifier.otpGenerator).to(OtpCodeGenerator);
    this.bind<ChannelGateway>(AuthIdentifier.channelGateway).toConstantValue(new ChannelHandlerGateway(this));
    this.bind<HashGateway>(AuthIdentifier.hashGateway).to(OdbHashGateway);
    this.bind<RequestSca>(RequestSca).to(RequestSca);
    this.bind<RequestVerifier>(RequestVerifier).to(RequestVerifier);
    this.bind<VerifyCredentials>(VerifyCredentials).to(VerifyCredentials);
    this.bind<AuthenticationGateway>(AuthIdentifier.authenticationGateway).to(OdbAuthenticationGateway);
    this.bind<SignIn>(SignIn).to(SignIn);
    this.bind<IdentityEncodingService>(AuthIdentifier.identityEncodingService).to(JwtTokenHandlers);
    this.bind<InvitationGateway>(AuthIdentifier.invitationGateway).to(SendInvitationGateway);
    this.bind<IdentityEncoder>(AuthIdentifier.identityEncoder).toConstantValue(
      new AuthToken({ ...jwt.common, expiredAt: jwt.auth.expiredAt, secret: jwt.auth.secret }),
    );
    this.bind<IdentityEncoder>(AuthIdentifier.identityEncoder).toConstantValue(
      new ScaToken({ ...jwt.common, expiredAt: jwt.sca.expiredAt, secret: jwt.sca.secret }),
    );
    this.bind<RegisterCreate>(RegisterCreate).to(RegisterCreate);
    this.bind<RegisterValidate>(RegisterValidate).to(RegisterValidate);
    this.bind(RestrictedVerifierMapper).toConstantValue(new RestrictedVerifierMapper());
    this.bind<BusDelivery>(AuthIdentifier.busDelivery).toConstantValue(
      new AzureBusDelivery(
        ServiceBusClient.createFromConnectionString(
          this.domainConfiguration.eventConfiguration.serviceBusConnectionString,
        ),
      ),
    );
    this.bind<SetPinCode>(SetPinCode).to(SetPinCode);
    this.bind(CleanPinCode).to(CleanPinCode);
    this.bind<InvitationMapper>(AuthIdentifier.mappers.invitation).to(InvitationMapper);
    this.bind<GetUser>(GetUser).to(GetUser);

    this.bind<AuthRequestGenerator<UserData, GeneratedProvisionRequest>>(
      AuthIdentifier.provisioningRequestGenerator,
    ).toConstantValue(new ProvisioningRequestGenerator(this.domainConfiguration));
    this.bind<AuthRequestGenerator<UserUid, { consultRequest: string }>>(
      AuthIdentifier.consultRequestGenerator,
    ).toConstantValue(
      new IcgRefAuthConsultRequestGenerator(this.domainConfiguration.icgConfig.odbCompanyCode),
    );
    this.bind<AuthRequestHandler>(AuthIdentifier.authRequestHandler).toConstantValue(
      new IcgRefAuthSoapRequestHandler(
        new IcgRetryStrategyGenerator(this.get(SymLogger)),
        this.get(SymLogger),
        this.domainConfiguration,
      ),
    );

    this.bind<ProvisioningFunctionalErrorFactory>(AuthIdentifier.provisioningFunctionalErrorFactory).to(
      IcgProvisioningFunctionalErrorFactory,
    );

    const icgProvisioningGateway = new IcgProvisioningGateway(
      this.get(AuthIdentifier.provisioningRequestGenerator),
      this.get(AuthIdentifier.consultRequestGenerator),
      this.get(AuthIdentifier.authRequestHandler),
      this.get(SymLogger),
      this.get(AuthIdentifier.getProfileInformationGateway),
      this.domainConfiguration.icgConfig.odbCompanyCode,
    );

    this.bind<PhoneProvisioningGateway>(AuthIdentifier.phoneProvisioningGateway).toConstantValue(
      icgProvisioningGateway,
    );

    this.bind(ProvisionUserPhone).toConstantValue(
      new ProvisionUserPhone(
        this.get(AuthIdentifier.userRepository),
        this.get(AuthIdentifier.authRequestHandler),
        this.get(SymLogger),
        this.get(EventDispatcher),
        this.get(EventProducerDispatcher),
        this.get(AuthIdentifier.provisioningFunctionalErrorFactory),
        this.get<PhoneProvisioningGateway>(AuthIdentifier.phoneProvisioningGateway),
        this.domainConfiguration.icgConfig.icgRefAuthBaseUrl,
        this.domainConfiguration.errorNotificationRecipient,
        this.domainConfiguration.icgConfig.odbCompanyCode,
      ),
    );

    this.bind<StrongAuthRequestGenerator>(AuthIdentifier.strongAuthRequestGenerator).toConstantValue(
      icgStrongAuthRequestGenerator,
    );
    this.bind<SignatureGateway>(AuthIdentifier.signatureGateway).toConstantValue(
      new OdbSignatureGateway({
        signSelfCertificate: this.domainConfiguration.secretService.odbSignCert,
        signSelfPassPhrase: this.domainConfiguration.secretService.odbSignCertPass,
      }),
    );

    this.bind<RedirectHandler<SamlResponse, AuthRequestPayload, AuthInitSession>>(
      AuthIdentifier.redirectHandler,
    ).toConstantValue(
      new IcgRedirectHandler(
        icgStrongAuthRequestGenerator,
        new IcgRetryStrategyGenerator(this.get(SymLogger)),
        this.domainConfiguration.rejectSelfSignedCerfificateSamlRequest,
        this.get(SymLogger),
      ),
    );
    this.bind<SignatureGateway>(AuthIdentifier.signatureGateway).toConstantValue(
      new OdbSignatureGateway({
        signSelfCertificate: this.domainConfiguration.secretService.odbSignCert,
        signSelfPassPhrase: this.domainConfiguration.secretService.odbSignCertPass,
      }),
    );

    this.bind<AuthVerificationGateway>(AuthIdentifier.authVerificationGateway).toConstantValue(
      new SamlVerificationGateway(
        domParser,
        this.domainConfiguration.secretService.icgSamlResponseSignCert,
        this.get(EventDispatcher),
        this.domainConfiguration.errorNotificationRecipient,
      ),
    );

    this.bind<AuthValidationResonseHandler>(AuthIdentifier.authValidationResponseHandler).toConstantValue(
      new IcgAuthValidationResponseHandler(
        this.get<AuthVerificationGateway>(AuthIdentifier.authVerificationGateway),
        this.get(SymLogger),
        this.domainConfiguration.toggleAuthResponseSignatureVerification,
      ),
    );

    this.bind<RetryStrategyGenerator>(AuthIdentifier.retryStrategyGenerator).toConstantValue(
      new IcgRetryStrategyGenerator(this.get(SymLogger)),
    );
    this.bind<VerifierGenerator<{ cookies: string[] }>>(AuthIdentifier.verifierGenerator).to(
      IcgVerifierGenerator,
    );
    this.bind<AuthRequestGenerator<UserUid, GeneratedEchoRequest>>(
      AuthIdentifier.echoRequestGenerator,
    ).toConstantValue(new IcgRefAuthEchoRequestGenerator(this.domainConfiguration));

    // this.bind<boolean>(ExtraIdentifier.useIcgSmsAuthFactorSym).toConstantValue(this.domainConfiguration.useIcgSmsAuthFactor);

    this.bind<CardGateway>(AuthIdentifier.cardGateway).toConstantValue(
      new UserCardGateway(encryptionGateway),
    );

    this.bind<CardProvisioningGateway>(AuthIdentifier.cardProvisioningGateway).toConstantValue(
      icgProvisioningGateway,
    );

    this.bind<ProvisionUserCard>(ProvisionUserCard).toConstantValue(
      new ProvisionUserCard(
        this.get<CardProvisioningGateway>(AuthIdentifier.cardProvisioningGateway),
        this.get(AuthIdentifier.userRepository),
        this.get(SymLogger),
        this.get(EventDispatcher),
        this.get(EventProducerDispatcher),
        this.get(AuthIdentifier.provisioningFunctionalErrorFactory),
        this.get(AuthIdentifier.cardGateway),
        this.domainConfiguration.icgConfig.icgRefAuthBaseUrl,
        this.domainConfiguration.errorNotificationRecipient,
        this.domainConfiguration.icgConfig.odbCompanyCode,
      ),
    );

    this.bind<ProfileGateway>(AuthIdentifier.userProfileGateway).toConstantValue(
      new UserProfileGateway(serviceApiProvider),
    );
    this.bind(ConsumeVerifier).to(ConsumeVerifier);
    this.bind(SignUpUser).to(SignUpUser);
    this.bind(PingRefAuth).to(PingRefAuth);
    this.bind(PingAuth).to(PingAuth);
    this.bind(OneyTokenKeys).to(OneyTokenKeys);
    this.bind(ProvisionUserPassword).to(ProvisionUserPassword);
    this.bind(BlockUser).to(BlockUser);

    return this;
  }

  getDependencies(): DomainDependencies {
    return {
      signUpUser: this.get(SignUpUser),
      requestSca: this.get(RequestSca),
      requestVerifier: this.get(RequestVerifier),
      consumeVerifier: this.get(ConsumeVerifier),
      verifierService: this.get<VerifierBase>(AuthIdentifier.verifierService),
      verifyCredentials: this.get(VerifyCredentials),
      provisionUserPhone: this.get(ProvisionUserPhone),
      identityEncoder: this.get<IdentityEncodingService>(AuthIdentifier.identityEncodingService),
      verifierRepository: this.get<VerifierRepository>(AuthIdentifier.verifierRepository),
      userRepository: this.get<UserRepository>(AuthIdentifier.userRepository),
      signIn: this.get(SignIn),
      invitationRepository: this.get<InvitationRepository>(AuthIdentifier.invitationRepository),
      registerCreate: this.get(RegisterCreate),
      registerValidate: this.get(RegisterValidate),
      getUser: this.get(GetUser),
      oneyTokenKeys: this.get(OneyTokenKeys),
      /*mappers: {
        invitationMappers: this.get<InvitationMapper>(AuthIdentifier.mappers.invitation),
        userMapper: this.get<JWTUserMapper>(AuthIdentifier.mappers.user),
      },*/
      cleanPinCode: this.get(CleanPinCode),
      setPinCode: this.get(SetPinCode),
      getPhoneStep: this.resolve(PhoneStepValidatedEventHandler),
      getUserCardProvisioningHandler: this.resolve(CardSentEventHandler),
      getProvisioningRequestGenerator: this.get<AuthRequestGenerator<UserData, GeneratedProvisionRequest>>(
        AuthIdentifier.provisioningRequestGenerator,
      ),
      getAuthRequestHandler: this.get<AuthRequestHandler>(AuthIdentifier.authRequestHandler),
      getChannelGateway: this.get<ChannelGateway>(AuthIdentifier.channelGateway),
      getEchoRequestGenerator: this.get<AuthRequestGenerator<UserUid, GeneratedEchoRequest>>(
        AuthIdentifier.echoRequestGenerator,
      ),
      provisionUserPassword: this.get(ProvisionUserPassword),
      blockUser: this.get(BlockUser),
    };
  }

  initStorageDependencies(authAccessServiceKey: string, frontDoorApiBaseUrl: string): StorageDependencies {
    const serviceApiProvider = new ServiceApiProvider(
      httpBuilder(new AxiosHttpMethod())
        .setBaseUrl(`${frontDoorApiBaseUrl}`)
        .setDefaultHeaders({
          Authorization: `Bearer ${authAccessServiceKey}`,
        }),
      'SERVICE_API_ERROR',
    );
    this.bind<GetProfileInformationGateway>(AuthIdentifier.getProfileInformationGateway).toConstantValue(
      new OdbGetProfileInformationGateway(serviceApiProvider),
    );

    this.bind(UserMapper).to(UserMapper);

    const inMemory = async (inMemoryStorage: InMemoryStorage): Promise<AuthenticationBuildDependencies> => {
      const repositories: BuildDependencies = {
        userRepository: new InMemoryUserRepository(inMemoryStorage.userMap),
        invitationRepository: new InMemoryInvitationRepository(inMemoryStorage.invitationMap),
        verifierRepository: new InMemoryVerifierRepository(inMemoryStorage.verifierMap),
      };

      this.bind<VerifierRepository>(AuthIdentifier.verifierRepository).toConstantValue(
        repositories.verifierRepository,
      );
      this.bind(AuthIdentifier.userRepository).toConstantValue(repositories.userRepository);
      this.bind<InvitationRepository>(AuthIdentifier.invitationRepository).toConstantValue(
        repositories.invitationRepository,
      );
      return this;
    };

    const mongoDb = async (dbUrl: string, dbName: string): Promise<AuthenticationBuildDependencies> => {
      await connect(dbUrl, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true,
        dbName,
      });

      if (!this.isBound(Connection)) {
        this.bind(Connection).toConstantValue(connection);
      }

      const repositories: BuildDependencies = {
        userRepository: new MongodbUserRepository(
          this.get<UserMapper>(UserMapper),
          this.get(AuthIdentifier.getProfileInformationGateway),
        ),
        invitationRepository: new MongodbInvitationRepository(),
        verifierRepository: new MongodbVerifierRepository(),
      };
      this.bind<VerifierRepository>(AuthIdentifier.verifierRepository).toConstantValue(
        repositories.verifierRepository,
      );
      this.bind(AuthIdentifier.userRepository).toConstantValue(repositories.userRepository);
      this.bind<InvitationRepository>(AuthIdentifier.invitationRepository).toConstantValue(
        repositories.invitationRepository,
      );
      return this;
    };

    return {
      inMemory,
      mongoDb,
    };
  }

  // istanbul ignore next : tested by integration tests
  addMessagingPlugin(messagingPlugin: MessagingPlugin): this {
    buildDomainEventDependencies(this).usePlugin(messagingPlugin);
    return this;
  }
}
