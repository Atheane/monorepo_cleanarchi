import { ExpressAuthenticationMiddleware } from '@oney/common-adapters';
import { Kernel } from '@oney/common-core';
import { ServiceName } from '@oney/identity-core';
import { buildProfileAdapterLib } from '@oney/profile-adapters';
import { Container } from 'inversify';
import { configureEventHandler, EventManager } from '@oney/messages-adapters';
import { SubscriptionCreated } from '@oney/subscription-messages';
import { EnvConfiguration, KeyVaultConfiguration } from '../server/EnvConfiguration';
import { SubscriptionCreatedHandler } from '../../modules/onboarding/handlers/SubscriptionCreatedHandler';

export class AppKernel extends Container implements Kernel {
  constructor(
    private readonly envConfiguration: EnvConfiguration,
    private readonly keyvaultConfiguration: KeyVaultConfiguration,
  ) {
    super();
  }

  async initDependencies(inMemoryMode: boolean) {
    this.bind(ExpressAuthenticationMiddleware).to(ExpressAuthenticationMiddleware);
    await buildProfileAdapterLib(
      this,
      {
        inMemoryMode,
        providersConfig: {
          cdpConfig: {
            baseUrl: this.envConfiguration.cdpApiUrl,
            authToken: this.keyvaultConfiguration.cdpApiKey,
            timeout: this.envConfiguration.cdpApiTimeout,
          },
          odbPaymentConfig: {
            baseUrl: this.envConfiguration.odbPaymentBaseUrl,
            token: this.keyvaultConfiguration.odbPaymentToken,
          },
          oneytrustConfig: {
            otBaseUrl: this.envConfiguration.otApiUrl,
            secretKey: this.keyvaultConfiguration.otSecretKey,
            entityReference: this.keyvaultConfiguration.otEntityReference,
            login: this.keyvaultConfiguration.otLogin,
            oneyTrustFolderBaseApi: this.envConfiguration.oneyTrustFolderBaseApi,
            caseType: this.envConfiguration.oneytrustCaseType,
            language: this.envConfiguration.oneytrustLanguage,
            flagCallbackUrlInPayload: this.envConfiguration.flagCallbackUrlInPayload,
            callbackDecisionUrl: this.envConfiguration.callbackDecisionUrl,
          },
          oneyB2CConfig: {
            odbOneyB2CKey: this.keyvaultConfiguration.oneyB2CConfiguration.odbOneyB2CKey,
            OdbOneyB2CApiXAuthAuthor: this.keyvaultConfiguration.oneyB2CConfiguration
              .OdbOneyB2CApiXAuthAuthor,
            odbOneyB2CApiClientSecret: this.keyvaultConfiguration.oneyB2CConfiguration
              .odbOneyB2CApiClientSecret,
            tokenExpiration: this.envConfiguration.oneyB2CtokenExpiration,
            odbOneyB2CApiClientId: this.keyvaultConfiguration.oneyB2CConfiguration.odbOneyB2CApiClientId,
            odbOneyB2CKeyId: this.keyvaultConfiguration.oneyB2CConfiguration.odbOneyB2CKeyId,
            apiVersion: this.envConfiguration.oneyB2CapiVersion,
            baseUrl: this.envConfiguration.oneyB2CbaseUrl,
            OdbOneyB2CApiXAuthAuthent: this.keyvaultConfiguration.oneyB2CConfiguration
              .OdbOneyB2CApiXAuthAuthent,
            featureFlagContract: this.envConfiguration.oneyContractFeatureFlag,
          },
          oneyFccFicp: {
            apiKey: this.keyvaultConfiguration.oneyFccFicp.apiKey,
            oneyFccFicpApiXAuthAuthent: this.keyvaultConfiguration.oneyFccFicp.oneyFccFicpApiXAuthAuthent,
            partnerGuid: this.keyvaultConfiguration.oneyFccFicp.partnerGuid,
            secretKey: this.keyvaultConfiguration.oneyFccFicp.secretKey,
            baseUrl: this.envConfiguration.oneyFccFicpBaseUrl,
          },
        },
        mongoUrl: this.keyvaultConfiguration.mongoDbPath,
        mongoCollection: this.envConfiguration.mongoDbCollection,
        serviceBusUrl: this.keyvaultConfiguration.serviceBusUrl,
        serviceBusSub: this.envConfiguration.serviceBusSub,
        serviceBusTopic: this.envConfiguration.serviceBusTopic,
        serviceBusProfileAzfTopic: this.envConfiguration.serviceBusProfileAzfTopic,
        topicPaymentAzfEkyc: this.envConfiguration.topicPaymentAzfEkyc,
        odbPaymentTopic: this.envConfiguration.odbPaymentTopic,
        topicOdbAggregation: this.envConfiguration.topicOdbAggregation,
        otpExpirationTime: this.envConfiguration.otpExpirationTime,
        otpMaxAttempts: this.envConfiguration.otpMaxAttempts,
        otpLockDuration: this.envConfiguration.otpLockDuration,
        activateGenericOtp: this.envConfiguration.activateGenericOtp,
        otpDbConfig: {
          dbMongoCollection: this.envConfiguration.otpMongoDbCollection,
          dbMongoUrl: this.keyvaultConfiguration.mongoDbPath,
        },
        odbProfileBlobStorageCs: this.keyvaultConfiguration.odbProfileBlobStorageCs,
        blobStorageContainerName: this.envConfiguration.blobStorageContainerName,
        odbContractPath: this.envConfiguration.odbContractPath,
        odbCdpTopic: this.envConfiguration.odbCdpTopic,
        customerServiceTopicsVersion: this.envConfiguration.customerServiceTopicsVersion,
        featureFlag: { profileStatusSaga: this.envConfiguration.featureFlag.profileStatusSaga },
        frontDoorApiBaseUrl: this.envConfiguration.frontDoorApiBaseUrl,
        documentGeneratorApiUrl: this.envConfiguration.documentGeneratorApiUrl,
      },
      {
        serviceName: ServiceName.profile,
        secret: this.keyvaultConfiguration.jwtSecret,
        azureTenantId: this.envConfiguration.azureAdTenantId,
        jwtOptions: {
          ignoreExpiration: false,
        },
        azureClientIds: {
          oney_compta: this.envConfiguration.azureAuthConfiguration.oneyCompta,
          pp_de_reve: this.envConfiguration.azureAuthConfiguration.ppDeReve,
        },
        applicationId: this.keyvaultConfiguration.applicationId,
      },
    );
    await configureEventHandler(this, (em: EventManager) => {
      em.register(SubscriptionCreated, SubscriptionCreatedHandler, {
        topic: this.envConfiguration.odbSubscriptionTopic,
      });
    });
    return this;
  }
}
