import { injectable } from 'inversify';
import * as NodeCache from 'node-cache';
import { CacheGateway } from '@oney/common-core';

@injectable()
export class NodeCacheGateway implements CacheGateway {
  constructor(private readonly _cache: NodeCache) {}

  set(keyName: string, value: string, expireDate: number): boolean {
    return this._cache.set(keyName, value, expireDate);
  }

  setTtl(keyName: string, ttl: number): boolean {
    return this._cache.ttl(keyName, ttl);
  }

  get(keyName: string): Record<string, number> {
    return {
      value: this._cache.get(keyName),
      ttl: this._cache.getTtl(keyName),
    };
  }

  onExpiration(action: (...args: any[]) => void): void {
    this._cache.on('expired', action);
  }
}
