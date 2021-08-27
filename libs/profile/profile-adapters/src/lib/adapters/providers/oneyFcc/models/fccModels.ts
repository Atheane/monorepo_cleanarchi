export interface OneyGetFlagResponse {
  fcc_flag: string;
}
export interface GetFlagResponse {
  status: number;
  flag: OneyGetFlagResponse;
}
export interface OneyGetRequestIdResponse {
  fcc_request_id: string;
}
export interface GetRequestIdResponse {
  status: number;
  requestId: OneyGetRequestIdResponse;
}
export interface GetRequestIdCommand {
  partner_guid: string;
  encrypted_message: EncryptMessageRequest;
}
interface EncryptMessageRequest {
  birth_name: string;
  first_name: string;
  birth_country_code: string;
  birth_department_code: string;
  birth_district_code: string;
  birth_municipality: string;
  birth_date: string;
  married_name: string;
  person_ids: {
    application_code: string;
    application_person_id: string;
    application_person_id_field: string;
  };
  external_reference_code: string;
  external_reference_type: string;
  request_cause_code: string;
}
