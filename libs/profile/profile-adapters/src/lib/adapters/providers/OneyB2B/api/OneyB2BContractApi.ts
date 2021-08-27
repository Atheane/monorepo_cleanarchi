import { IHttpBuilder } from '@oney/http';

export interface ContractReferencesDates {
  start_date?: string;
  end_date?: string;
  termination_date?: string;
}

export interface PersonRole {
  person_role_code: string;
  application_code: string;
  application_person_id_field: string;
  application_person_id: string; // Profile uid
}

export interface CreateContractsReference {
  number: string; // bank account ID
  type_code: string;
  family_code: string;
  subscription_date?: string;
  person_roles: PersonRole[];
  payment_account_contract_references?: ContractReferencesDates;
}

export interface UpdateContractReference {
  type_code: string;
  subscription_date: string;
  payment_account_contract_references: ContractReferencesDates;
}

export interface ContractsReferencesRequest {
  contract_reference: CreateContractsReference;
}

export interface UpdateContractsReferencesRequest {
  number: string; // bank account ID
  contract_reference: UpdateContractReference;
}

export class OneyB2BContractApi {
  constructor(private readonly _http: IHttpBuilder) {}

  async create(request: ContractsReferencesRequest): Promise<void> {
    await this._http.post(`/b2b/customers/v2/contracts_references`, request).execute();
  }

  async update(request: UpdateContractsReferencesRequest): Promise<void> {
    const { number, ...body } = request;
    await this._http.put(`/b2b/customers/v2/contracts_references/PAYMENT_ACCOUNT/${number}`, body).execute();
  }
}
