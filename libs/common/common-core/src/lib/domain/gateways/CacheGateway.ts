export interface CacheGateway {
  set(keyName: string, value: string, expireDate: number): boolean;
  setTtl(keyName: string, ttl: number): boolean;
  get(keyName: string): Record<string, number>;
  onExpiration(listener: (...args: any[]) => void): void;
}
