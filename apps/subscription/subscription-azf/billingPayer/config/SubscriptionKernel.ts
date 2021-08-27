import { Container } from 'inversify';
import {
  azureBusModule,
  billingModule,
  mongoDbSubscriberImplementation,
  subscriptionModule,
} from '@oney/subscription-adapters';
import { Connection, createConnection } from 'mongoose';
import { SymLogger } from '@oney/logger-core';
import { configureLogger } from '@oney/logger-adapters';
import { KeyvaultConfiguration, LocalConfiguration } from './EnvConfiguration';

export class SubscriptionKernel extends Container {
  constructor(
    private readonly _envConfiguration: LocalConfiguration,
    private readonly _keyvaultConfiguration: KeyvaultConfiguration,
  ) {
    super();
    configureLogger(this);
  }

  async initDependencies(): Promise<SubscriptionKernel> {
    // We ignore this because we dont want to test in production mode
    const mongoUrl =
      process.env.NODE_ENV === 'production'
        ? /* istanbul ignore next */ this._keyvaultConfiguration.mongoDbPath
        : process.env.MONGO_URL;
    const connection = await createConnection(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (!this.isBound(Connection)) {
      this.bind(Connection).toConstantValue(connection);
    }
    this.load(
      subscriptionModule,
      azureBusModule(
        this,
        {
          serviceBusUrl: this._keyvaultConfiguration.serviceBusUrl,
          subscription: this._envConfiguration.odbSubscriptionBus,
          channel: this._envConfiguration.odbSubscriptionTopic,
        },
        this.get(SymLogger),
      ),
      mongoDbSubscriberImplementation(connection),
      billingModule({
        frontDoorBaseApiUrl: this._envConfiguration.frontDoorApiUrl,
        authKey: this._keyvaultConfiguration.paymentAuthKey,
      }),
    );
    return this;
  }
}
