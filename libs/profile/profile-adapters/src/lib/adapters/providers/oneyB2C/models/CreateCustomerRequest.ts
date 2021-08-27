export type PersonIds = {
  application_code: string;
  application_person_id_field: string;
  application_person_id: string; // Profile uid
};

export type OneyCrmEmails = {
  address: string;
  type_code: string;
};

export type OneyCrmLocation = {
  type_code: string; // HOME
  line1: string;
  line2?: string;
  municipality: string;
  postal_code: string;
  country_code: string;
};

export type OneyCrmContact = {
  number: string;
  type_code: string;
  country_dialing_code: string;
};

export interface CreateCustomerRequest {
  honorific_code: string;
  birth_name: string;
  first_name: string;
  birth_country: string;
  birth_departement_code: string;
  birth_district_code?: string;
  birth_country_code: string;
  person_ids?: PersonIds[];
  emails: OneyCrmEmails[];
  birth_municipality: string;
  adresses?: OneyCrmLocation[];
  phones?: OneyCrmContact[];
  birth_date: string; // 'YYYY-MM-DD'
  married_name?: string;
  cnil_partner_flag?: string;
  cnil_oney_flag?: string;
  len_oney_flag?: string;
  len_partner_flag?: string;
}
