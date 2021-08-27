export interface SignatureGateway {
  sign(value: string): Promise<string>;
}
