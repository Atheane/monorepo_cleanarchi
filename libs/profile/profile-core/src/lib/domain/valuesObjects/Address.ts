import { PublicProperties } from '@oney/common-core';

export class Address {
  street: string;
  additionalStreet?: string;
  city: string;
  zipCode: string;
  country: string;

  constructor(address: PublicProperties<Address>) {
    Object.assign(this, address);
  }
}
