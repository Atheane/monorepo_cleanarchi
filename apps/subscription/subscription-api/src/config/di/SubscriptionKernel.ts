import { configureLogger } from '@oney/logger-adapters';
import { SymLogger } from '@oney/logger-core';
import { Container } from 'inversify';
import {
  azureBusModule,
  initHttpClients,
  cacheModule,
  mongoDbSubscriberImplementation,
  subscriptionModule,
} from '@oney/subscription-adapters';
import { ExpressAuthenticationMiddleware } from '@oney/common-adapters';
import { configureIdentityLib } from '@oney/identity-adapters';
import { ServiceName } from '@oney/identity-core';
import { Connection } from 'mongoose';
import { ProfileActivated, ProfileCreated, SituationAttached } from '@oney/profile-messages';
import {
  AttachCard,
  BillPaymentOrdered,
  CreateMembership,
  SubscriberActivated,
  SubscriptionCancelled,
  SubscriptionCreated,
} from '@oney/subscription-messages';
import { configureEventHandler, EventManager } from '@oney/messages-adapters';
import { CardStatusUpdated } from '@oney/payment-messages';
import { SubscriptionSyms } from './SubscriptionSyms';
import { ProfileCreatedHandler } from '../../modules/subscribers/handlers/ProfileCreatedHandler';
import { EnvConfiguration, KeyvaultConfiguration } from '../server/EnvConfiguration';
import { CustomerTypeHandler } from '../../modules/subscribers/handlers/CustomerTypeHandler';
import { ProfileActivatedHandler } from '../../modules/subscribers/handlers/ProfileActivatedHandler';
import { SubscriberActivatedHandler } from '../../modules/subscriptions/handlers/SubscriberActivatedHandler';
import { SubscriptionCreatedHandler } from '../../modules/subscriptions/handlers/SubscriptionCreatedHandler';
import { SubscriptionCancelledHandler } from '../../modules/subscriptions/handlers/SubscriptionCancelledHandler';
import { DomainErrorMiddleware } from '../server/middlewares/DomainErrorMiddleware';
import { SubscriptionProceededHandler } from '../../modules/subscriptions/handlers/SubscriptionProceededHandler';
import { BillOrderedHandler } from '../../modules/billings/handlers/BillOrderedHandler';
import { CardStatusUpdatedHandler } from '../../modules/subscriptions/handlers/CardStatusUpdatedHandler';
import { CreateMembershipHandler } from '../../modules/insurance/handlers/CreateMembershipHandler';

export class SubscriptionKernel extends Container {
  constructor(
    private readonly _envConfiguration: EnvConfiguration,
    private readonly _keyvaultConfiguration: KeyvaultConfiguration,
  ) {
    super();
    configureLogger(this);
  }

  async initDependencies(connection: Connection): Promise<SubscriptionKernel> {
    if (!this.isBound(Connection)) {
      this.bind(Connection).toConstantValue(connection);
    }
    this.load(
      subscriptionModule,
      azureBusModule(
        this,
        {
          channel: this._envConfiguration.odbSubscriptionTopic,
          serviceBusUrl: this._keyvaultConfiguration.serviceBusUrl,
          subscription: this._envConfiguration.odbSubscriptionBus,
        },
        this.get(SymLogger),
      ),
      mongoDbSubscriberImplementation(connection),
    );

    await configureIdentityLib(this, {
      applicationId: null,
      azureClientIds: {
        oney_compta: null,
        pp_de_reve: null,
      },
      jwtOptions: {
        ignoreExpiration: false,
      },
      azureTenantId: null,
      secret: this._envConfiguration.jwtSecret,
      serviceName: ServiceName.subscription,
      frontDoorBaseApiUrl: null,
    });
    this.bind(SubscriptionSyms.defaultOffer).toConstantValue(this._envConfiguration.defaultOffer);
    this.bind(SubscriptionSyms.sagaDelayBeforeDispatch).toConstantValue(
      this._envConfiguration.sagaDelayBeforeDispatch,
    );
    this.bind(ExpressAuthenticationMiddleware).to(ExpressAuthenticationMiddleware);
    this.bind(DomainErrorMiddleware).toSelf();
    const profileTopic = this._envConfiguration.odbProfileTopic;
    const subscriptionTopic = this._envConfiguration.odbSubscriptionTopic;
    await configureEventHandler(this, (em: EventManager) => {
      em.register(SituationAttached, CustomerTypeHandler, {
        topic: profileTopic,
      });
      em.register(ProfileCreated, ProfileCreatedHandler, {
        topic: profileTopic,
      });
      em.register(ProfileActivated, ProfileActivatedHandler, {
        topic: profileTopic,
      });
      em.register(SubscriberActivated, SubscriberActivatedHandler, {
        topic: subscriptionTopic,
      });
      em.register(SubscriptionCreated, SubscriptionCreatedHandler, {
        topic: subscriptionTopic,
      });
      em.register(SubscriptionCancelled, SubscriptionCancelledHandler, {
        topic: subscriptionTopic,
      });
      em.register(AttachCard, SubscriptionProceededHandler, {
        topic: subscriptionTopic,
      });
      em.register(BillPaymentOrdered, BillOrderedHandler, {
        topic: subscriptionTopic,
      });
      em.register(CardStatusUpdated, CardStatusUpdatedHandler, {
        topic: this._envConfiguration.odbPaymentTopic,
      });
    });
    return this;
  }

  async initSpbConfiguration() {
    this.load(cacheModule());
    await initHttpClients(this, {
      spbApiConfiguration: {
        spbAuthApi: this._envConfiguration.spbAuthApi,
        grantType: this._keyvaultConfiguration.spbConfig.grantType,
        clientId: this._keyvaultConfiguration.spbConfig.clientId,
        clientSecret: this._keyvaultConfiguration.spbConfig.clientSecret,
        clientCredentials: this._keyvaultConfiguration.spbConfig.clientCredentials,
        username: this._keyvaultConfiguration.spbConfig.username,
        password: this._keyvaultConfiguration.spbConfig.password,
        spbBaseApi: this._envConfiguration.spbBaseApi,
        bin8MissingChar: this._envConfiguration.bin8MissingChar,
      },
    });
    await configureEventHandler(this, (em: EventManager) => {
      em.register(CreateMembership, CreateMembershipHandler, {
        topic: this._envConfiguration.odbSubscriptionTopic,
      });
    });
  }
}
