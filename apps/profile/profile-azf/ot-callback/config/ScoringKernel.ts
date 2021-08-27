import { configureLogger } from '@oney/logger-adapters';
import { Container } from 'inversify';
import { EnvConfiguration, KeyVaultConfiguration } from './EnvConfiguration';
import { buildAzfScoring } from './build';

export class ScoringKernel extends Container {
  constructor(
    private readonly envConfiguration: EnvConfiguration,
    private readonly keyVaultConfiguration: KeyVaultConfiguration,
  ) {
    super();
    configureLogger(this);
  }

  async initDependencies(): Promise<Container> {
    await buildAzfScoring(this, {
      inMemoryMode: false,
      mongoUrl:
        // We ignore this test case because we dont want to test app in Production mode.
        /* istanbul ignore next */
        process.env.NODE_ENV === 'production' ? this.keyVaultConfiguration.mongoPath : process.env.MONGO_URL,
      mongoCollection: this.envConfiguration.mongoDbCollection,
      mongoUrlEventStore:
        // We ignore this test case because we dont want to test app in Production mode.
        /* istanbul ignore next */
        process.env.NODE_ENV === 'production'
          ? this.keyVaultConfiguration.mongoUrlEventStore
          : process.env.MONGO_URL,
      mongoCollectionEventStore: this.envConfiguration.mongoCollectionEventStore,
      serviceBusUrl: this.keyVaultConfiguration.serviceBusUrl,
      serviceBusSub: this.envConfiguration.serviceBusSub,
      serviceBusTopic: this.envConfiguration.serviceBusTopic,
    });

    return this;
  }
}
