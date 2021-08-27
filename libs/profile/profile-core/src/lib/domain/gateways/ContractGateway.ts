export interface CreateContractRequest {
  uid: string;
  bankAccountId: string;
}

export interface UpdateContractRequest {
  bankAccountId: string;
  date: Date;
}

export interface ContractGateway {
  create(createContractRequest: CreateContractRequest);
  update(updateContractRequest: UpdateContractRequest);
}
