export interface Fields {
  regex: string;
  connector_sources: string[];
  name: string;
  auth_mechanisms: string[];
  required: boolean;
  label: string;
  type: string;
  values?: { value: string; label: string }[];
}

export interface BIConnector {
  sync_frequency: number | null;
  code: string;
  color: string;
  available_auth_mechanisms: string[];
  beta: boolean;
  transfer_beneficiary_types: string[];
  slug: string;
  name: string;
  logo: string;
  uuid: string;
  account_types: string[];
  restricted: boolean;
  available_transfer_mechanisms: string[];
  auth_mechanism: string;
  capabilities: string[];
  id: number;
  transfer_execution_date_types: string[];
  months_to_fetch: number | null;
  urls: string[];
  fields: Fields[];
  siret: string | null;
  hidden: boolean;
  charged: boolean;
}
