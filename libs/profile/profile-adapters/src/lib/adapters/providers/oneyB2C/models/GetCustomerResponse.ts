interface Phone {
  number: string;
  country_dialing_code: string;
  type_code: string;
  status_date: string;
  start_date: string;
}

interface Email {
  address: string;
  type_code: string;
  start_date: string;
  status_date: string;
}

interface PersonId {
  application_code: string;
  application_person_id_field: string;
  application_person_id: string;
}

interface Customer {
  person_ids: PersonId[];
  honorific_code: string;
  birth_name: string;
  first_name: string;
  birth_date: string;
  birth_municipality: string;
  vip_flag: string;
  staff_member_flag: string;
  cnil_partner_flag?: string;
  cnil_oney_flag?: string;
  len_oney_flag?: string;
  len_partner_flag?: string;
  telemarketing_oney_refusal_flag: string;
  email_oney_refusal_flag: string;
  company_code: string;
  company_quit_date: string;
  employee_status: string;
  emails: Email[];
  phones: Phone[];
}

export interface GetCustomerResponse {
  customer: Customer[];
}
