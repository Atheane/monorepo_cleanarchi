export interface AuthVerificationGateway {
  checkSignature(document: string, uid: string): Promise<void>;
}
