import { PfmKernel } from '@oney/pfm-adapters';
import { IAppConfiguration } from '@oney/pfm-core';
import { configureIdentityLib } from '@oney/identity-adapters';
import { ServiceName } from '@oney/identity-core';
import * as mongoose from 'mongoose';

export class AppKernel extends PfmKernel {
  constructor(private readonly envConfiguration: IAppConfiguration, dbConnection: mongoose.Connection) {
    super(envConfiguration, dbConnection);
  }

  async initAppDependencies(): Promise<PfmKernel> {
    this.initDependencies();
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
