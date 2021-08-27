import { Card, CardGateway, EncryptionGateway } from '@oney/authentication-core';
import { DomainError } from '@oney/common-core';
import { injectable } from 'inversify';

@injectable()
export class UserCardGateway implements CardGateway {
  constructor(private readonly _encryptionGateway: EncryptionGateway) {}

  async decrypt(ciphertext: string): Promise<Card> {
    if (!ciphertext) this._throwCiphertextError();
    const plaintext = await this._encryptionGateway.decryptWithPrivateKey(ciphertext);
    const card: Card = JSON.parse(plaintext);
    return card;
  }

  private _throwCiphertextError(): never {
    const e = new DomainError('No encrypted card data in event');
    e.cause = { noCiphertext: true };
    throw e;
  }
}
