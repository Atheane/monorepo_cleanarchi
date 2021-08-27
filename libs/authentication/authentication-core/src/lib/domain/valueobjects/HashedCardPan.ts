import isCreditCard from 'validator/lib/isCreditCard';
import { PublicProperties } from '@oney/common-core';
import { createHash } from 'crypto';
import { EncryptionError } from '../models/AuthenticationError';
import { DefaultUiErrorMessages } from '../models/AuthenticationErrorMessage';

/**
 * Note: never store the plaintext PAN
 */
export class HashedCardPan {
  public hashedPan: string;

  private constructor(props: PublicProperties<HashedCardPan>) {
    Object.assign(this, props);
  }

  static hashPan(plaintext: string): string {
    if (!HashedCardPan.validatePan(plaintext))
      throw new EncryptionError.InvalidCardPan(DefaultUiErrorMessages.INVALID_CARD_PAN);
    const buffer = Buffer.from(plaintext, 'utf-8');
    const hashDigest = createHash('sha256').update(buffer).digest('hex');
    return hashDigest;
  }

  static from(plaintext: string): HashedCardPan {
    const hashedPan = HashedCardPan.hashPan(plaintext);
    return new HashedCardPan({ hashedPan });
  }

  static validatePan(plaintextPan: string): boolean {
    return isCreditCard(plaintextPan || '');
  }
}
