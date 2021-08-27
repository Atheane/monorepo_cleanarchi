export interface CreateBankAccountRequest {
  uid: string;
  city: string;
  country: string;
  street: string;
  additionalStreet?: string;
  zipCode: string;
}
