import { Kernel } from '@oney/common-core';
import { configureLogger } from '@oney/logger-adapters';
import { Container } from 'inversify';
import { buildAzfSmoneyEkyc } from './build';
import { EnvConfiguration, KeyVaultSecrets } from '../../config/EnvConfiguration';

export class AzfKernel extends Container implements Kernel {
  constructor(
    private readonly _envConfiguration: EnvConfiguration,
    private readonly _keyvault: KeyVaultSecrets,
  ) {
    super();
    configureLogger(this);
  }

  async initDependencies(inMemoryMode: boolean): Promise<this> {
    await buildAzfSmoneyEkyc(
      this,
      {
        inMemoryMode,
        forceAzureServiceBus: false,
        mongoCollection: this._envConfiguration.mongoDbCollection,
        serviceBusSub: this._envConfiguration.serviceBusSub,
        serviceBusTopic: this._envConfiguration.serviceBusTopic,
      },
      {
        mongoUrl: this._keyvault.eventStoreDbUrl,
        serviceBusUrl: this._keyvault.serviceBusUrl,
      },
    );
    return this;
  }
}
