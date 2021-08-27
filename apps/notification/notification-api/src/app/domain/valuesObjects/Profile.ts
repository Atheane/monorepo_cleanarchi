import { Address } from './Address';

export interface ProfileProperties {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthCountry: string;
  birthDate: Date;
  address: Address;
}

export class Profile {
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _phone: string;
  private _birthCountry: string;
  private _birthDate: Date;
  private _address: Address;

  private constructor(props: ProfileProperties) {
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._email = props.email;
    this._phone = props.phone;
    this._birthCountry = props.birthCountry;
    this._birthDate = props.birthDate;
    this._address = props.address;
  }

  static create(props: ProfileProperties): Profile {
    return new Profile(props);
  }

  public get firstName(): string {
    return this._firstName;
  }
  public get lastName(): string {
    return this._lastName;
  }
  public get email(): string {
    return this._email;
  }
  public get phone(): string {
    return this._phone;
  }
  public get birthCountry(): string {
    return this._birthCountry;
  }
  public get birthDate(): Date {
    return this._birthDate;
  }
  public get address(): Address {
    return this._address;
  }
}
