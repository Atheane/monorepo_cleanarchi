import { SymLogger } from '@oney/logger-core';
import { EventHandlerExecutionFinder, EventHandlerExecutionStore } from '@oney/messages-core';
import { PfmKernel } from '@oney/pfm-adapters';
import { IAppConfiguration } from '@oney/pfm-core';
import { ExpressAuthenticationMiddleware } from '@oney/common-adapters';
import { configureIdentityLib } from '@oney/identity-adapters';
import { ServiceName } from '@oney/identity-core';
import { configureMongoEventHandlerExecution, createAzureConnection } from '@oney/az-servicebus-adapters';
import * as mongoose from 'mongoose';

export class AppKernel extends PfmKernel {
  constructor(private readonly envConfiguration: IAppConfiguration, dbConnection: mongoose.Connection) {
    super(envConfiguration, dbConnection);
  }

  async initAppDependencies(): Promise<PfmKernel> {
    this.initDependencies();

    configureMongoEventHandlerExecution(this);

    this.useServiceBus(
      createAzureConnection(
        this.envConfiguration.eventsConfig.serviceBusUrl,
        this.envConfiguration.eventsConfig.serviceBusSubscription,
        this.envConfiguration.eventsConfig.pfmTopic,
        this.get(SymLogger),
        this.get(EventHandlerExecutionFinder),
        this.get(EventHandlerExecutionStore),
      ),
    );
    this.initBlobStorage();
    await this.initSubscribers();
    this.bind(ExpressAuthenticationMiddleware).toSelf();
    await configureIdentityLib(this, {
      jwtOptions: {
        ignoreExpiration: false,
      },
      azureTenantId: this.envConfiguration.azureAdTenantId,
      secret: this.envConfiguration.vault.jwtSecret,
      serviceName: ServiceName.pfm,
      applicationId: null,
      azureClientIds: {
        pp_de_reve: null,
        oney_compta: null,
      },
    });
    return this;
  }
}
