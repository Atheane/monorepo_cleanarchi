import { PublicProperties } from '@oney/common-core';
import validator from 'validator';
import { UserError } from '../models/AuthenticationError';
import { DefaultUiErrorMessages } from '../models/AuthenticationErrorMessage';

export class Email {
  public address: string;

  constructor(props: PublicProperties<Email>) {
    if (!Email.isValid(props.address || ''))
      throw new UserError.InvalidEmail(DefaultUiErrorMessages.INVALID_EMAIL_ADDRESS);
    Object.assign(this, props);
  }

  static isValid(raw: string): boolean {
    return validator.isEmail(raw || '');
  }

  static from(address: string): Email {
    return new Email({ address });
  }
}
