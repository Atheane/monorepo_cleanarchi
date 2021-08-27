import { Options } from './env.decorators';
import { EnvError } from './errors';

export const envDictionnary = new Map<string, any>();
export const providersMap = new Map<any, any>();
export const localSym = Symbol.for('LocalEnv');
export const keyvaultSym = Symbol.for('keyvaultSym');

export abstract class EnvService {
  abstract get(key: string, options: Options): Promise<string>;
}

const booleans = ['true', 'false'];

function preventIncorrectType(value: any, propertyType: any) {
  if (booleans.includes(value) && propertyType !== 'boolean') {
    throw new EnvError.IncorrectType(`value ${value} is not ${propertyType}, must be boolean`);
  }
  return value;
}

function transformValue(value: any, propertyType: any): any {
  try {
    return JSON.parse(value);
  } catch (e) {
    throw new EnvError.IncorrectType(`value ${value} is not ${propertyType}`);
  }
}

function envSanitizer(value: any, propertyType: any): boolean {
  if (propertyType === 'boolean' || propertyType === 'number' || booleans.includes(value)) {
    return transformValue(value, propertyType);
  }
  return preventIncorrectType(value, propertyType);
}

export function EnvLoader() {
  return (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<
      (
        ...args: any[]
      ) => Promise<
        {
          sym: symbol;
          instance: EnvService;
        }[]
      >
    >,
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const fn = descriptor.value!;
    // eslint-disable-next-line no-param-reassign
    descriptor.value = async function DescriptorValue(...args: any[]) {
      const providers: {
        sym: symbol;
        instance: EnvService;
      }[] = await fn.apply(this, ...args);
      for await (const key of Array.from(envDictionnary.keys())) {
        const t = envDictionnary.get(key);
        const instanceToLoad = providersMap.get(t.instance);
        if (instanceToLoad === localSym) {
          const localInstance = providers.find(item => item.sym === localSym);
          const value = await localInstance.instance.get(key, t.options);

          envDictionnary.set(key, { ...t, value: envSanitizer(value, t.propertyType) });
          // eslint-disable-next-line no-continue
          continue;
        }
        if (instanceToLoad === keyvaultSym) {
          const keyvaultInstance = providers.find(item => item.sym === keyvaultSym);
          if (!keyvaultInstance) {
            throw new EnvError.BadConfigurationError('Please provide a valid keyvault configuration');
          }
          const value = await keyvaultInstance.instance.get(key, t.options);
          envDictionnary.set(key, { ...t, value: envSanitizer(value, t.propertyType) });
          // eslint-disable-next-line no-continue
          continue;
        }
        throw new EnvError.MissingClassDecorator(
          `Please provide a valid class decorator Local or Keyvault in class ${JSON.stringify(t)}`,
        );
      }
      return providers;
    };
    return descriptor;
  };
}
