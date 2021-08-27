import { EncryptionGateway } from '@oney/authentication-core';
import { DomainError } from '@oney/common-core';
import { privateDecrypt, constants, createPrivateKey, PrivateKeyInput, RsaPrivateKey } from 'crypto';
import { DomainConfiguration } from '../models/DomainConfiguration';

export class OdbEncryptionGateway implements EncryptionGateway {
  constructor(private readonly domainConfiguration: DomainConfiguration) {}

  public async decryptWithPrivateKey(ciphertext64: string): Promise<string> {
    const ciphertextBuffer = Buffer.from(ciphertext64, 'base64');
    try {
      return this._attemptDecryption(ciphertextBuffer);
    } catch (error) {
      if (this._isPadding(error)) return this._attemptDecryptionWhenPaddingError(ciphertextBuffer);
      return Promise.reject(this._formatToDomain(error));
    }
  }

  private _decodePrivateKey(): string {
    const { cardDataDecryptionPrivKey } = this.domainConfiguration.secretService;
    const key64Buffer = Buffer.from(cardDataDecryptionPrivKey, 'base64');
    return key64Buffer.toString('utf-8');
  }

  private _attemptDecryption(ciphertextBuffer: Buffer): string {
    const privateKey = this._setPrivateKey(this._getPrivateKeyInput());
    return this._processDecryption(privateKey, ciphertextBuffer);
  }

  private _attemptDecryptionWhenPaddingError(ciphertextBuffer: Buffer): string {
    try {
      const privateKey = this._setPrivateKeyWithDefaultPadding(this._getPrivateKeyInput());
      return this._processDecryption(privateKey, ciphertextBuffer);
    } catch (error) {
      throw this._formatToDomain(error);
    }
  }

  private _getPrivateKeyInput(): PrivateKeyInput {
    return { key: this._decodePrivateKey(), passphrase: '' };
  }

  private _formatToDomain(error: any): DomainError {
    const domainError = new DomainError(error.message);
    domainError.cause = { decryptionError: true, ...error };
    return domainError;
  }

  // Specified padding is required to be able to correctly decrypt SMO card data without extra characters
  private _setPrivateKey(options: PrivateKeyInput): RsaPrivateKey {
    return {
      key: createPrivateKey(options),
      padding: constants.RSA_PKCS1_PADDING,
    };
  }

  private _setPrivateKeyWithDefaultPadding(options: PrivateKeyInput): RsaPrivateKey {
    return {
      key: createPrivateKey(options),
      padding: constants.RSA_PKCS1_OAEP_PADDING,
    };
  }

  private _processDecryption(privateKey: RsaPrivateKey, ciphertextBuffer: Buffer): string {
    const plaintext = privateDecrypt(privateKey, ciphertextBuffer).toString('utf-8');
    return plaintext;
  }

  private _isPadding(error: Error): boolean {
    return error.message.search(/padding.*decoding error/) !== -1;
  }
}
