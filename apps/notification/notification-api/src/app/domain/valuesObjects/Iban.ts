export interface IbanProperties {
  countryCode: string;
  bankCode: string;
  branchCode: string;
  accountNumber: string;
  checkDigits: string;
}

export class Iban {
  private _countryCode: string;
  private _bankCode: string;
  private _branchCode: string;
  private _accountNumber: string;
  private _checkDigits: string;

  private constructor(props: IbanProperties) {
    this._countryCode = props.countryCode;
    this._bankCode = props.bankCode;
    this._branchCode = props.branchCode;
    this._accountNumber = props.accountNumber;
    this._checkDigits = props.checkDigits;
  }

  static create(props: IbanProperties): Iban {
    return new Iban(props);
  }

  static extractIbanDetails(iban: string): IbanProperties {
    return {
      countryCode: iban.substring(0, 2),
      bankCode: iban.substring(4, 9),
      branchCode: iban.substring(9, 14),
      accountNumber: iban.substring(14, 25),
      checkDigits: iban.substring(25, 27),
    };
  }

  public get countryCode(): string {
    return this._countryCode;
  }
  public get bankCode(): string {
    return this._bankCode;
  }
  public get branchCode(): string {
    return this._branchCode;
  }
  public get accountNumber(): string {
    return this._accountNumber;
  }
  public get checkDigits(): string {
    return this._checkDigits;
  }
}
