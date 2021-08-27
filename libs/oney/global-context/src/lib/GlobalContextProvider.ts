import { assert } from 'ts-essentials';
import { Bad, Ok, OkVal } from '@oney/result';
import { OneyContext } from '@oney/context';
import { AsyncLocalStorage } from 'async_hooks';

export const GlobalContextProviderErrors = {
  GLOBAL_CONTEXT_NOT_AVAILABLE: 'GLOBAL_CONTEXT_NOT_AVAILABLE' as const,
};

export class GlobalContextProvider {
  private static readonly ns = new AsyncLocalStorage<Map<string, unknown>>();

  public static get available(): boolean {
    return !!this.ns.getStore();
  }

  private static readonly contextKey = '@oney/global-context-90030202-99b9-49ca-b9c8-01409373e94e';

  public static get<T extends OneyContext>(): OkVal<T> | Bad<'GLOBAL_CONTEXT_NOT_AVAILABLE'> {
    if (!this.available) {
      return Bad('GLOBAL_CONTEXT_NOT_AVAILABLE');
    }

    const result = this.getStoreOrThrow().get(this.contextKey) as T;

    return Ok(result);
  }

  public static set<T extends OneyContext>(context: T): OkVal<T> | Bad<'GLOBAL_CONTEXT_NOT_AVAILABLE'> {
    if (!this.available) {
      return Bad('GLOBAL_CONTEXT_NOT_AVAILABLE');
    }

    this.getStoreOrThrow().set(this.contextKey, context);

    return Ok(context);
  }

  public static getMetadata<T>(key: string): OkVal<T> | Bad<'GLOBAL_CONTEXT_NOT_AVAILABLE'> {
    if (!this.available) {
      return Bad('GLOBAL_CONTEXT_NOT_AVAILABLE');
    }

    const result = this.getStoreOrThrow().get(key) as T;

    return Ok(result);
  }

  public static setMetadata<T>(key: string, value: T): OkVal<T> | Bad<'GLOBAL_CONTEXT_NOT_AVAILABLE'> {
    if (!this.available) {
      return Bad('GLOBAL_CONTEXT_NOT_AVAILABLE');
    }

    this.getStoreOrThrow().set(key, value);

    return Ok(value);
  }

  public static run<R>(fn: () => R): R {
    const store = new Map<string, unknown>();
    return this.ns.run(store, fn);
  }

  private static getStoreOrThrow() {
    const store = this.ns.getStore();

    assert(store);

    return store;
  }
}
