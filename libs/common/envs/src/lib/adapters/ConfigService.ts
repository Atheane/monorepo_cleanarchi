import { KeyVaultService } from './KeyVaultService';
import { LocalEnv } from './LocalEnv';
import { EnvService, EnvLoader, keyvaultSym, localSym } from '../domain';

export class ConfigService {
  providers: {
    sym: symbol;
    instance: EnvService;
  }[] = [];

  constructor(options: { localUri?: string; keyvaultUri?: string }) {
    if (options.keyvaultUri) {
      this.providers.push({
        sym: keyvaultSym,
        instance: new KeyVaultService({ url: options.keyvaultUri }),
      });
    }
    this.providers.push({
      instance: new LocalEnv({ url: options.localUri }),
      sym: localSym,
    });
  }

  @EnvLoader()
  async loadEnv() {
    return this.providers;
  }
}
