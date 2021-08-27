// eslint-disable-next-line max-classes-per-file
import 'reflect-metadata';
import * as path from 'path';
import { ConfigService } from '../adapters';
import { Env, envDictionnary, Local, Load, providersMap, KeyVault } from '../domain';
import { EnvError } from '../domain/errors';

const envPath = path.resolve(__dirname + '/env/test.env');

describe('ConfigService tests', () => {
  beforeEach(() => {
    envDictionnary.clear();
    providersMap.clear();
  });

  it('Should print the property set in decorator', async () => {
    @Local()
    class EnvVariables {
      @Env('ALOHA', { required: false, defaultValue: 'london' })
      aloha: string;

      @Env('HELLO', { required: true })
      hello: string;
    }
    await new ConfigService({ localUri: envPath, keyvaultUri: 'ooko' }).loadEnv();

    const result = new EnvVariables();
    expect(result.aloha).toEqual('hawai');
    expect(result.hello).toEqual('world');
  });

  it('Should have a default value', async () => {
    @Local()
    class EnvVariables {
      @Env('DEFAULT', { required: false, defaultValue: 'london' })
      aloha: string;
    }

    @KeyVault(true)
    class KeyvaultDefaultValue {
      @Env('Testing', { required: false, defaultValue: 'tonton' })
      tonton: string;
    }

    await new ConfigService({ localUri: envPath, keyvaultUri: 'ooko' }).loadEnv();

    const result = new EnvVariables();
    const keyvault = new KeyvaultDefaultValue();

    expect(result.aloha).toEqual('london');
    expect(keyvault.tonton).toEqual('tonton');
  });

  it('Should throw error cause required is not a boolean', async () => {
    const testError = () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class EnvVariables {
        @Env('DEFAULT', { required: null, defaultValue: 'london' })
        aloha: string;
      }
    };

    await new ConfigService({ localUri: envPath, keyvaultUri: 'ooko' }).loadEnv();

    expect(testError).toThrow(EnvError.IncorrectType);
  });

  it('Should throw error cause default value not provided', async () => {
    const testError = () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class EnvVariables {
        @Env('DEFAULT', { required: false, defaultValue: '' })
        aloha: string;
      }
    };

    await new ConfigService({ localUri: envPath, keyvaultUri: 'ooko' }).loadEnv();

    expect(testError).toThrow(EnvError.MissingDefaultValue);
  });

  it('Should load configuration class', async () => {
    @Local()
    class NestedNestedInstance {
      @Env('HELLO', { required: true })
      hello: string;
    }
    @Local()
    class NestedVariable {
      @Env('ALOHA', { required: true })
      aloha: string;

      @Load(NestedNestedInstance)
      nestedInstance: NestedNestedInstance;
    }

    @Local()
    class EnvVariables {
      @Load(NestedVariable)
      nestedVariable: NestedVariable;
    }

    await new ConfigService({ localUri: envPath, keyvaultUri: 'ooko' }).loadEnv();
    const results = new EnvVariables();
    expect(results.nestedVariable.aloha).toEqual('hawai');
    expect(results.nestedVariable.nestedInstance.hello).toEqual('world');
  });

  it('Should be able to load multiple time ConfigService', async () => {
    @Local()
    class NestedNestedInstance {
      @Env('HELLO', { required: true })
      hello: string;

      @Env('TEST_BOOL', { required: true })
      isBoolean: boolean;
    }
    @Local()
    class NestedVariable {
      @Env('ALOHA', { required: true })
      aloha: string;

      @Env('TEST_FALSE', { required: true })
      isBoolean: boolean;

      @Load(NestedNestedInstance)
      nestedInstance: NestedNestedInstance;
    }

    @Local()
    class EnvVariables {
      @Load(NestedVariable)
      nestedVariable: NestedVariable;
    }
    const loadEnv = async () => {
      await new ConfigService({ localUri: envPath, keyvaultUri: 'ooko' }).loadEnv();
    };

    await loadEnv();
    await loadEnv();
    await loadEnv();
    await loadEnv();
    const results = new EnvVariables();

    expect(results.nestedVariable.aloha).toEqual('hawai');
    expect(results.nestedVariable.nestedInstance.hello).toEqual('world');
    expect(results.nestedVariable.nestedInstance.isBoolean).toEqual(true);
    expect(results.nestedVariable.isBoolean).toEqual(false);
  });

  it('Should throw error cause string is not boolean on defaultValue', async () => {
    @Local()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    class EnvVariables {
      @Env('TEST_BOOL_NOT_PROVIDED', { required: false, defaultValue: 'azeazeaze' })
      isBoolean: boolean;
    }

    const loadEnv = async () => {
      await new ConfigService({ localUri: envPath, keyvaultUri: 'ooko' }).loadEnv();
    };

    await expect(loadEnv()).rejects.toThrow(EnvError.IncorrectType);
  });

  it('Should convert default value to boolean', async () => {
    @Local()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    class EnvVariables {
      @Env('TEST_BOOL_NOT_PROVIDED', { required: false, defaultValue: 'true' })
      isBoolean: boolean;
    }

    await new ConfigService({ localUri: envPath, keyvaultUri: 'ooko' }).loadEnv();

    expect(EnvVariables.prototype.isBoolean).toEqual(true);
  });

  it('Shoult throw error cause value is not a number', async () => {
    @Local()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    class NestedNestedInstance {
      @Env('TEST_BAD_NUMBER', { required: true })
      hello: number;
    }

    const result = new ConfigService({ localUri: envPath, keyvaultUri: 'ooko' }).loadEnv();
    await expect(result).rejects.toThrow(EnvError.IncorrectType);
  });

  it('Shoult throw error cause value is not a boolean', async () => {
    @Local()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    class NestedNestedInstance {
      @Env('TEST_BAD_BOOL', { required: true })
      hello: boolean;
    }

    const result = new ConfigService({ localUri: envPath, keyvaultUri: 'ooko' }).loadEnv();
    await expect(result).rejects.toThrow(EnvError.IncorrectType);
  });

  it('Should throw error cause missing env', async () => {
    @Local()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    class NestedNestedInstance {
      @Env('MissingEnv', { required: true })
      hello: string;
    }

    const result = new ConfigService({ localUri: envPath, keyvaultUri: 'ooko' }).loadEnv();
    await expect(result).rejects.toThrow(Error);
  });

  it('Should emit error cause no class decorator has been set', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    class NestedNestedInstance {
      @Env('MissingDecorator', { required: true })
      hello: string;
    }

    const result = new ConfigService({ localUri: envPath, keyvaultUri: 'ooko' }).loadEnv();
    await expect(result).rejects.toThrow(EnvError.MissingClassDecorator);
  });

  it('Should emit error cause env is empty', async () => {
    @Local()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    class NestedNestedInstance {
      @Env('EMPTY')
      hello: string;
    }

    const result = new ConfigService({ localUri: envPath, keyvaultUri: 'ooko' }).loadEnv();
    await expect(result).rejects.toThrow(EnvError.EmptyEnv);
  });

  it('Should resolve untype boolean', async () => {
    @Local()
    class NestedNestedInstance {
      @Env('TEST_NON_TYPE_BOOL')
      hello;
    }

    await new ConfigService({ localUri: envPath, keyvaultUri: 'ooko' }).loadEnv();
    expect(NestedNestedInstance.prototype.hello).toEqual(true);
  });

  it('Should throw error cause keyvaultUri is null and production is true', async () => {
    @KeyVault(true)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    class KeyVaultInstance {
      @Env('alo', { required: true })
      hello: string;
    }

    const config = new ConfigService({ localUri: envPath, keyvaultUri: null }).loadEnv();
    await expect(config).rejects.toThrow(EnvError.BadConfigurationError);
  });

  it('Should load KeyVault in Local env', async () => {
    @Local()
    class NestedNestedInstance {
      @Env('HELLO', { required: true })
      hello: string;
    }

    @KeyVault(false)
    class KeyVaultInstance {
      @Env('KEYVAULT_TEST', { required: true })
      hello: string;
    }

    await new ConfigService({ localUri: envPath, keyvaultUri: null }).loadEnv();
    const result = new NestedNestedInstance();
    const keyvaultInstance = new KeyVaultInstance();
    expect(result.hello).toEqual('world');
    expect(keyvaultInstance.hello).toEqual('shouldbeloadedcauseprodfalse');
  });
});
