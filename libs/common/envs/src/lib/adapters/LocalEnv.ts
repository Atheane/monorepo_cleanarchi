import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { EnvService, Options } from '../domain';
import { EnvError } from '../domain/errors';

export class LocalEnv extends EnvService {
  private readonly envConfig: Record<string, string>;

  constructor(options?: { url: string }) {
    super();
    if (!options.url) {
      this.envConfig = process.env;
    } else {
      this.envConfig = dotenv.parse(fs.readFileSync(options.url));
    }
  }

  private checkEnv(key: string) {
    switch (this.envConfig[key]) {
      case '':
        throw new EnvError.EmptyEnv(`${key} exists but is empty`);
      case undefined:
      case null:
        throw new EnvError.EnvNotFound(`missing ${key} in configuration file`);
      default:
        return this.envConfig[key];
    }
  }

  async get(key: string, options: Options) {
    if (options.required === false) {
      return this.envConfig[key] == null ? options.defaultValue : this.envConfig[key];
    }
    return this.checkEnv(key);
  }
}
