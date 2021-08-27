export interface EncryptionGateway {
  decryptWithPrivateKey(encryptedData: string): Promise<string>;
}
