export const ficpRequestCommandMockWithMarriedName = {
  encrypted_message: {
    birth_country_code: 'FR',
    birth_date: '1990-01-01',
    birth_department_code: '75',
    birth_district_code: '02',
    birth_municipality: 'Paris',
    birth_name: 'MAZEN',
    external_reference_code: 'SP_2021119__fMZo_lKM_h8LUZS2Wb',
    external_reference_type: 'BQ_DIGIT_PROPOSAL',
    first_name: 'MAZENDK',
    married_name: 'MAZEN',
    person_ids: {
      application_code: 'BQ_DIGIT',
      application_person_id: 'AWzclPFyN',
      application_person_id_field: 'SID',
    },
    request_cause_code: 'BQ_DIGIT',
  },
  partner_guid: 'e2d564e96a1b4bb5a8bef41c48a6bf88',
};

export const ficpRequestCommandMockWithoutMarriedName = {
  encrypted_message: {
    birth_country_code: 'FR',
    birth_date: '1990-01-01',
    birth_department_code: '75',
    birth_district_code: '02',
    birth_municipality: 'Paris',
    birth_name: 'MAZEN',
    external_reference_code: 'SP_2021119__fMZo_lKM_h8LUZS2Wb',
    external_reference_type: 'BQ_DIGIT_PROPOSAL',
    first_name: 'MAZENDK',
    married_name: '',
    person_ids: {
      application_code: 'BQ_DIGIT',
      application_person_id: 'AWzclPFyN',
      application_person_id_field: 'SID',
    },
    request_cause_code: 'BQ_DIGIT',
  },
  partner_guid: 'e2d564e96a1b4bb5a8bef41c48a6bf88',
};
