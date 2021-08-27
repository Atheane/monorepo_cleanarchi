export interface IdentityEncoder {
  encode<T extends Record<any, any>>(payload: T): string;
  decode<T extends Record<any, any>>(hash: string): T;
}
