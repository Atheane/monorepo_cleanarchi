export interface AddressProperties {
  street: string;
  additionalStreet?: string;
  city: string;
  zipCode: string;
  country: string;
}

export class Address {
  private _street: string;
  private _additionalStreet?: string;
  private _city: string;
  private _zipCode: string;
  private _country: string;

  constructor(props: AddressProperties) {
    this._street = props.street;
    this._city = props.city;
    this._country = props.country;
    this._zipCode = props.zipCode;
    if (props.additionalStreet) this._additionalStreet = props.additionalStreet;
  }

  addAdditionalStreet(additionalStreet: string): void {
    this._additionalStreet = additionalStreet;
  }

  static create(props: AddressProperties): Address {
    return new Address(props);
  }

  public get street(): string {
    return this._street;
  }
  public get additionalStreet(): string {
    return this._additionalStreet;
  }
  public get city(): string {
    return this._city;
  }
  public get zipCode(): string {
    return this._zipCode;
  }
  public get country(): string {
    return this._country;
  }
}
