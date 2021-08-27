import 'reflect-metadata';
import { envDictionnary, providersMap, localSym, keyvaultSym } from './EnvService';
import { EnvError } from './errors';

export type Options =
  | {
      required: true;
    }
  | {
      required: false;
      defaultValue: string;
    };

function checkOptions(key: string, options?: Options): Options {
  if (!options) {
    return {
      required: true,
    };
  }
  if (typeof options.required !== 'boolean') {
    throw new EnvError.IncorrectType(`Required must be a boolean on ${key}`);
  }
  if (options.required === false && !options.defaultValue) {
    throw new EnvError.MissingDefaultValue(`Must provide a default Value on env non required on ${key}`);
  }
  return options;
}

export function Env(key: string, options?: Options) {
  return (target, propertyKey) => {
    const propertyType: Function = Reflect.getMetadata('design:type', target, propertyKey);
    const propertyTypeName = propertyType ? propertyType.name.toLowerCase() : null;
    envDictionnary.set(key, {
      instance: target.constructor.name,
      value: key,
      propertyType: propertyTypeName,
      options: checkOptions(key, options),
    });
    Object.defineProperty(target, propertyKey, {
      get: () => envDictionnary.get(key).value,
      enumerable: true,
    });
  };
}

export function Local() {
  return target => {
    providersMap.set(target.name, localSym);
  };
}

export function KeyVault(production: boolean) {
  return target => {
    providersMap.set(target.name, production ? keyvaultSym : localSym);
  };
}

export function Load(instance: any) {
  return (target: any, propertyKey: string) => {
    Object.defineProperty(target, propertyKey, {
      // eslint-disable-next-line new-cap
      get: () => new instance(),
    });
  };
}
