import { BankConnectionError } from '../models';
import { ISigninField } from '../types';

export class UrlCallBack {
  private urlCallback: string;
  constructor(private readonly form: ISigninField[]) {
    const relevantInput = form.find(field => field.name === 'url_callback');
    if (relevantInput) {
      this.urlCallback = relevantInput.value;
    } else {
      throw new BankConnectionError.FieldValidationFailure(
        "form must have an input with property 'name' set at 'url_callback'",
      );
    }
  }

  validate(): boolean {
    try {
      return !!new URL(this.urlCallback).origin;
    } catch (e) {
      throw new BankConnectionError.FieldValidationFailure(
        "form must have an input with property 'value' set at a proper url",
      );
    }
  }

  get value(): string {
    return this.urlCallback;
  }
}
