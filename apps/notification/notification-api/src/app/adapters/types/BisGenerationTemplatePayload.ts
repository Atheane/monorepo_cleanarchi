export interface BisGenerationTemplatePayload {
  account: {
    uid: string;
    iban: string;
    bic: string;
  };
  user: {
    profile: {
      address: {
        street: string;
        city: string;
        zip_code: string;
        country: string;
      };
      birth_name: string;
      first_name: string;
    };
  };
  bank_details: {
    bank_code: string;
    branch_code: string;
    account_number: string;
    check_digits: string;
  };
}
