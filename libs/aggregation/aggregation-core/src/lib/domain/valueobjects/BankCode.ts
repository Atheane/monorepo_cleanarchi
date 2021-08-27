import { BankError } from '../models/BankErrors';

export class BankCode {
  private code: string;

  constructor(code: string) {
    const regexp5Digits = /^[0-9]{5}$|^[A-Z]{4}$/; // special case for Revolut, waiting for more info on possible exotic banque codes
    if (code !== null && regexp5Digits.test(code)) {
      this.code = code;
    } else {
      throw new BankError.InvalidBankCode();
    }
  }

  get value(): string {
    return this.code;
  }
}
