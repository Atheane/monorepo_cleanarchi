export interface RecipientRegisteredProperties {
  uid: string;
  profile: ProfileProperties;
  preferences: PreferencesProperties;
}

export interface ProfileProperties {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthCountry: string;
  birthDate: Date;
  address: AddressProperties;
}

export interface PreferencesProperties {
  allowAccountNotifications: boolean;
  allowTransactionNotifications: boolean;
}

export interface IbanProperties {
  countryCode: string;
  bankCode: string;
  branchCode: string;
  accountNumber: string;
  checkDigits: string;
}

export interface BicProperties {
  bankCode: string;
  countryCode: string;
  locationCode: string;
  branchCode?: string;
}

export interface AddressProperties {
  street: string;
  additionalStreet?: string;
  city: string;
  zipCode: string;
  country: string;
}
