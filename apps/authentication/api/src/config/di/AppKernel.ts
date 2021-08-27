import {
  AuthenticationBuildDependencies,
  CardSentEventHandler,
  PhoneStepValidatedEventHandler,
} from '@oney/authentication-adapters';
import { Kernel } from '@oney/common-core';
import { configureEventHandler } from '@oney/messages-adapters';
import { CardSent } from '@oney/payment-messages';
import { PhoneStepValidated } from '@oney/profile-messages';
import { Envs } from '../server/Envs';

export class AppKernel extends AuthenticationBuildDependencies implements Kernel {
  constructor(envs: Envs) {
    const envConfiguration = envs.getKeyvaultSecret();
    const localConfiguration = envs.getLocalVariables();
    super({
      rejectSelfSignedCerfificateSamlRequest: localConfiguration.rejectSelfSignedCerfificateSamlRequest,
      rejectSelfSignedCerfificateRefauthRequest: localConfiguration.rejectSelfSignedCerfificateRefauthRequest,
      tokenKeys: {
        oneyFr: envConfiguration.tokenKeys.oneyFr,
      },
      secretService: {
        odbSignCertPass: envConfiguration.secretService.odbSignCertPass,
        odbSignCert: envConfiguration.secretService.odbSignCert,
        cardDataDecryptionPubKey: envConfiguration.secretService.cardDataDecryptionPubKey,
        cardDataDecryptionPrivKey: envConfiguration.secretService.cardDataDecryptionPrivKey,
        clientPrivKey: envConfiguration.secretService.clientPrivKey,
        clientCert: envConfiguration.secretService.clientCert,
        caCert: envConfiguration.secretService.caCert,
        icgSamlResponseSignCert: envConfiguration.secretService.icgSamlResponseSignCert,
      },
      jwt: {
        sca: {
          secret: envConfiguration.jwt.sca.secret,
          expiredAt: envConfiguration.jwt.sca.expiredAt,
        },
        common: {
          issuer: envConfiguration.jwt.common.issuer,
          audience: envConfiguration.jwt.common.audience,
        },
        auth: {
          secret: envConfiguration.jwt.auth.secret,
          expiredAt: envConfiguration.jwt.auth.expiredAt(localConfiguration.userTokenExpirationInMinutes),
        },
      },
      icgConfig: {
        odbCompanyCode: localConfiguration.icgConfig.odbCompanyCode,
        odbSigAlgUrl: localConfiguration.icgConfig.odbSigAlgUrl,
        icgVerifyPath: localConfiguration.icgConfig.icgVerifyPath,
        icgSamlPath: localConfiguration.icgConfig.icgSamlPath,
        icgRefAuthPath: localConfiguration.icgConfig.icgRefAuthPath,
        icgRefAuthBaseUrl: localConfiguration.icgConfig.icgRefAuthBaseUrl,
        icgContextId: localConfiguration.icgConfig.icgContextId,
        icgBaseUrl: localConfiguration.icgConfig.icgBaseUrl,
        icgApplication: localConfiguration.icgConfig.icgApplication,
      },
      eventConfiguration: {
        subscription: envConfiguration.eventConfiguration.subscription,
        serviceBusConnectionString: envConfiguration.eventConfiguration.serviceBusConnectionString,
      },
      useIcgSmsAuthFactor: localConfiguration.useIcgSmsAuthFactor,
      invitation: localConfiguration.invitationConfiguration,
      profileTopic: localConfiguration.profileTopic,
      frontDoorApiBaseUrl: localConfiguration.frontDoorApiBaseUrl,
      authenticationTopic: localConfiguration.authenticationTopic,
      errorNotificationRecipient: localConfiguration.errorNotificationRecipient,
      cardLifecycleFunctionTopic: localConfiguration.cardLifecycleFunctionTopic,
      userTokenExpirationInMinutes: localConfiguration.userTokenExpirationInMinutes,
      toggleAuthResponseSignatureVerification: localConfiguration.toggleAuthResponseSignatureVerification,
    });
  }

  async initDependencies() {
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async initSubscribers(envs: Envs): Promise<AppKernel> {
    await configureEventHandler(this, em => {
      em.register(PhoneStepValidated, PhoneStepValidatedEventHandler, {
        topic: envs.getLocalVariables().profileTopic,
      });

      em.register(CardSent, CardSentEventHandler, {
        topic: envs.getLocalVariables().cardLifecycleFunctionTopic,
      });
    });

    return this;
  }
}
