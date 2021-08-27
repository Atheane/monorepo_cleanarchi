import { EventHandlerExecutionFinder, EventHandlerExecutionStore } from '@oney/messages-core';
import { Container, ContainerModule, interfaces } from 'inversify';
import {
  ActivateSubscriber,
  ActivateSubscription,
  Bill,
  EnrollSubscriber,
  GetOffers,
  GetSubscriberById,
  GetSubscriptionsBySubscriberId,
  BillSubscriptions,
  Subscriber,
  SubscribeToOffer,
  Subscription,
  SubscriptionIdentifier,
  UpdateCustomerType,
  BillSubscription,
  GetBillBySubscriptionId,
  GetInactiveSubscription,
  CancelSubscriptionByOfferId,
  ProcessSubscription,
  UpdateSubscriptionStatus,
  GetSubscriptionByCardId,
  UpdateSubscriptionNextBillingDate,
  PayBills,
  CreateMembershipInsurance,
  InsuranceGateway,
} from '@oney/subscription-core';
import { initRxMessagingPlugin } from '@oney/rx-events-adapters';
import { buildDomainEventDependencies } from '@oney/ddd';
import { Connection } from 'mongoose';
import { configureMongoEventHandlerExecution, createAzureConnection } from '@oney/az-servicebus-adapters';
import { NodeCacheGateway, ServiceApiProvider } from '@oney/common-adapters';
import { AxiosHttpMethod, httpBuilder } from '@oney/http';
import * as NodeCache from 'node-cache';
import { Logger } from '@oney/logger-core';
import { CacheGateway } from '@oney/common-core';
import { InMemoryOdbOfferRepository } from './repositories/inMemory/InMemoryOdbOfferRepository';
import { OdbOfferMapper } from './partners/odb/mappers/OdbOfferMapper';
import { InMemoryOdbSubscriberRepository } from './repositories/inMemory/InMemoryOdbSubscriberRepository';
import { OdbPeriodicityMapper } from './partners/odb/mappers/types/OdbPeriodicityMapper';
import { MongodbSubscriberRepository } from './repositories/mongodb/MongodbSubscriberRepository';
import { InMemoryOdbBillingRepository } from './repositories/inMemory/InMemoryOdbBillingRepository';
import { MongodbBillingRepository } from './repositories/mongodb/MongodbBillingRepository';
import { InMemorySubscriptionRepository } from './repositories/inMemory/InMemorySubscriptionRepository';
import { MongodbSubscriptionRepository } from './repositories/mongodb/MongodbSubscriptionRepository';
import { SubscriberDoc, SubscriberModel } from './repositories/mongodb/models/SubscriberModel';
import { BillDoc, BillModel } from './repositories/mongodb/models/BillModel';
import { SubscriptionDoc, SubscriptionModel } from './repositories/mongodb/models/SubscriptionModel';
import { OdbDiscountTypeMapper } from './partners/odb/mappers/types/OdbDiscountTypeMapper';
import { OdbPaymentGateway } from './gateways/OdbPaymentGateway';
import { initSPBHttpClient } from './partners/spb/initSPBHttpClient';
import { SPBInsuranceGateway } from './gateways/SPBInsuranceGateway';
import { SPBNetworkProvider } from './partners/spb/SPBNetworkProvider';

export interface SPBApiConfiguration {
  spbAuthApi: string;
  grantType: string;
  clientId: string;
  clientSecret: string;
  clientCredentials: string;
  username: string;
  password: string;
  spbBaseApi: string;
  bin8MissingChar: string;
}

export interface HttpClientsConfiguration {
  spbApiConfiguration: SPBApiConfiguration;
}

export const subscriptionModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(OdbOfferMapper).to(OdbOfferMapper);
  bind(OdbPeriodicityMapper).toSelf();
  bind(OdbDiscountTypeMapper).toSelf();
  bind(SubscriptionIdentifier.offerRepository).to(InMemoryOdbOfferRepository);
  bind(GetOffers).to(GetOffers);
  bind(SubscribeToOffer).to(SubscribeToOffer);
  bind(EnrollSubscriber).to(EnrollSubscriber);
  bind(UpdateCustomerType).to(UpdateCustomerType);
  bind(ActivateSubscriber).to(ActivateSubscriber);
  bind(GetSubscriberById).to(GetSubscriberById);
  bind(BillSubscriptions).to(BillSubscriptions);
  bind(BillSubscription).to(BillSubscription);
  bind(GetBillBySubscriptionId).to(GetBillBySubscriptionId);
  bind(ActivateSubscription).to(ActivateSubscription);
  bind(GetSubscriptionsBySubscriberId).to(GetSubscriptionsBySubscriberId);
  bind(GetInactiveSubscription).to(GetInactiveSubscription);
  bind(CancelSubscriptionByOfferId).to(CancelSubscriptionByOfferId);
  bind(ProcessSubscription).to(ProcessSubscription);
  bind(UpdateSubscriptionStatus).to(UpdateSubscriptionStatus);
  bind(GetSubscriptionByCardId).to(GetSubscriptionByCardId);
  bind(UpdateSubscriptionNextBillingDate).to(UpdateSubscriptionNextBillingDate);
});

export const billingModule = (config: { authKey: string; frontDoorBaseApiUrl: string }) => {
  const httpClient = httpBuilder(new AxiosHttpMethod())
    .setBaseUrl(config.frontDoorBaseApiUrl)
    .setDefaultHeaders({
      Authorization: `Basic ${config.authKey}`,
    });
  const serviceApiProvider = new ServiceApiProvider(httpClient, 'PAYMENT_API_ERROR');
  return new ContainerModule((bind: interfaces.Bind) => {
    bind(PayBills).to(PayBills);
    bind(SubscriptionIdentifier.paymentGateway).toConstantValue(new OdbPaymentGateway(serviceApiProvider));
  });
};

export const inMemorySubscriptionImplems = (store: {
  subscriberDb: Map<string, Subscriber>;
  billDb: Map<string, Bill>;
  subscriptionDb: Map<string, Subscription>;
}): ContainerModule => {
  return new ContainerModule(bind => {
    bind(SubscriptionIdentifier.subscriberRepository).toConstantValue(
      new InMemoryOdbSubscriberRepository(store.subscriberDb),
    );
    bind(SubscriptionIdentifier.billingRepository).toConstantValue(
      new InMemoryOdbBillingRepository(store.billDb),
    );
    bind(SubscriptionIdentifier.subscriptionRepository).toConstantValue(
      new InMemorySubscriptionRepository(store.subscriptionDb),
    );
  });
};

// We ignore this because we test this implem on the subscription-azf and subscription-api.
/* istanbul ignore next */
export const mongoDbSubscriberImplementation = (mongodb: Connection): ContainerModule => {
  return new ContainerModule(bind => {
    const subscriberModel = mongodb.model<SubscriberDoc>('subscribers', new SubscriberModel());
    const billModel = mongodb.model<BillDoc>('bills', new BillModel());
    const subscriptionModel = mongodb.model<SubscriptionDoc>('subscriptions', new SubscriptionModel());

    bind(SubscriptionIdentifier.subscriberRepository).toConstantValue(
      new MongodbSubscriberRepository(subscriberModel),
    );
    bind(SubscriptionIdentifier.billingRepository).toConstantValue(new MongodbBillingRepository(billModel));
    bind(SubscriptionIdentifier.subscriptionRepository).toConstantValue(
      new MongodbSubscriptionRepository(subscriptionModel),
    );
  });
};

export const inMemoryBusModule = (container: Container): ContainerModule => {
  return new ContainerModule(() => {
    const messagingPlugins = initRxMessagingPlugin();
    buildDomainEventDependencies(container).usePlugin(messagingPlugins);
  });
};

// We ignore this because we test this implem on the subscription-azf and subscription-api.
/* istanbul ignore next */
export const azureBusModule = (
  container: Container,
  config: {
    serviceBusUrl: string;
    subscription: string;
    channel: string;
  },
  logger: Logger,
): ContainerModule => {
  return new ContainerModule(() => {
    configureMongoEventHandlerExecution(container);
    const messagingPlugins = createAzureConnection(
      config.serviceBusUrl,
      config.subscription,
      config.channel,
      logger,
      container.get(EventHandlerExecutionFinder),
      container.get(EventHandlerExecutionStore),
    );
    buildDomainEventDependencies(container).usePlugin(messagingPlugins);
  });
};

export const cacheModule = (): ContainerModule => {
  const cache = new NodeCache({ checkperiod: 5 });
  return new ContainerModule(bind => {
    bind<CacheGateway>(SubscriptionIdentifier.cacheGateway).toConstantValue(new NodeCacheGateway(cache));
  });
};

export const initHttpClients = async (
  container: Container,
  config: HttpClientsConfiguration,
): Promise<Container> => {
  const spbHttpClient = await initSPBHttpClient(
    config.spbApiConfiguration,
    container.get<CacheGateway>(SubscriptionIdentifier.cacheGateway),
  );
  container.bind(CreateMembershipInsurance).to(CreateMembershipInsurance);

  container
    .bind<InsuranceGateway>(SubscriptionIdentifier.insuranceGateway)
    .toConstantValue(
      new SPBInsuranceGateway(
        new SPBNetworkProvider(spbHttpClient),
        config.spbApiConfiguration.bin8MissingChar,
      ),
    );
  return container;
};
