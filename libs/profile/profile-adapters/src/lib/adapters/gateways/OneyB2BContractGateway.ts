import { ContractGateway, CreateContractRequest, UpdateContractRequest } from '@oney/profile-core';
import { ApiProvider } from '@oney/common-core';
import { injectable } from 'inversify';
import * as moment from 'moment';
import {
  ContractsReferencesRequest,
  UpdateContractsReferencesRequest,
} from '../providers/OneyB2B/api/OneyB2BContractApi';
import { OneyB2BApis } from '../providers/OneyB2B/OneyB2BApiProvider';

@injectable()
export class OneyB2BContractGateway implements ContractGateway {
  constructor(private readonly _apiProvider: ApiProvider<OneyB2BApis>) {}

  async create(createContractRequest: CreateContractRequest): Promise<void> {
    const { uid, bankAccountId } = createContractRequest;
    const request: ContractsReferencesRequest = {
      contract_reference: {
        number: bankAccountId,
        type_code: 'CAPPED',
        family_code: 'PAYMENT_ACCOUNT',
        subscription_date: null,
        person_roles: [
          {
            person_role_code: 'SUBSCRIBER',
            application_code: 'BQ_DIGIT',
            application_person_id_field: 'SID',
            application_person_id: uid,
          },
        ],
        payment_account_contract_references: {
          start_date: null,
        },
      },
    };
    await this._apiProvider.api().contractApi.create(request);
  }

  async update(updateContractRequest: UpdateContractRequest): Promise<void> {
    const { bankAccountId, date } = updateContractRequest;
    const request: UpdateContractsReferencesRequest = {
      number: bankAccountId,
      contract_reference: {
        type_code: 'CAPPED',
        subscription_date: moment(date).format('YYYY-MM-DD'),
        payment_account_contract_references: {
          start_date: moment(date).format('YYYY-MM-DD'),
        },
      },
    };
    await this._apiProvider.api().contractApi.update(request);
  }
}
