import { PublicProperties } from '@oney/common-core';

export interface IFieldOption {
  value: string;
  name?: string;
}
export enum IBankField {
  TEXT = 'text',
  PASSWORD = 'password',
  LIST = 'list',
  DATE = 'date',
}

export class BankField {
  label: string;

  name: string;

  type: IBankField;

  validation?: RegExp;

  options?: IFieldOption[];

  constructor(bankField?: PublicProperties<BankField>) {
    Object.assign(this, bankField);
    this.validation = this.validation ? new RegExp(this.validation) : null;
  }

  validate(type: string, value?: string): boolean {
    if (!this.validation) {
      return true;
    }
    return this.validation.test(value);
  }
}
