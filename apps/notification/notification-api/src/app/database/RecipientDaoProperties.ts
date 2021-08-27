export interface AddressProperties {
  street: string;
  additionalStreet?: string;
  city: string;
  zipCode: string;
  country: string;
}

interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthCountry: string;
  birthDate: Date;
  address: AddressProperties;
}

interface PreferencesProperties {
  allowAccountNotifications: boolean;
  allowTransactionNotifications: boolean;
}

export interface RecipientDaoProperties {
  uid: string;
  profile: Profile;
  preferences: PreferencesProperties;
}
