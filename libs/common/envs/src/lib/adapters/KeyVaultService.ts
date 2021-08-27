import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';
import { EnvService, Options } from '../domain';

export class KeyVaultService extends EnvService {
  private readonly client: SecretClient;

  constructor(options: { url: string }) {
    super();
    this.client = new SecretClient(options.url, new DefaultAzureCredential());
  }

  async get(key: string, options: Options) {
    try {
      const secret = await this.client.getSecret(key);
      return secret.value;
    } catch (e) {
      if (options.required === false) {
        return options.defaultValue;
      }
      throw e;
    }
  }
}
