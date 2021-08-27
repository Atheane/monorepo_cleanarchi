export interface OneyGetFicpFlagResponse {
  ficp_flag: string;
}

export interface GetFicpFlagResponse {
  status: number;
  flag: OneyGetFicpFlagResponse;
}

export interface OneyGetFicpRequestIdResponse {
  ficp_request_id: number;
}

export interface GetFicpRequestIdResponse {
  status: number;
  requestId: OneyGetFicpRequestIdResponse;
}

export type PersonId = {
  application_code: string; // BQ_DIGIT
  application_person_id_field: string;
  application_person_id: string; // Profile uid
};

export interface EncryptMessageRequest {
  external_reference_code: string; // caseReference
  external_reference_type: string; // BQ_DIGIT_PROPOSAL
  person_ids: PersonId;
  married_name: string;
  birth_name: string;
  first_name: string;
  birth_date: string;
  birth_country_code: string;
  birth_department_code: string;
  birth_municipality: string;
  birth_district_code: string;
  request_cause_code: string; // BQ_DIGIT
}

export interface GetFicpRequestIdCommand {
  partner_guid: string;
  encrypted_message: EncryptMessageRequest;
}
