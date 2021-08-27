export interface Identifier {
  id: string;
  type: string;
}

export interface AuthenticationFactor {
  id: number;
  type: string;
  public_value: string;
  status_code: string;
  status_date: string;
}

export interface DigitalIdentityResponse {
  id: number;
  type: string;
  creation_date: string;
  last_connection_date?: string;
  identifiers: Identifier[];
  authentication_factors: AuthenticationFactor[];
}
