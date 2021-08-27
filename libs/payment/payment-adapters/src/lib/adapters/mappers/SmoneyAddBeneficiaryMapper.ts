import { BeneficiaryProperties } from '@oney/payment-core';
import { Mapper } from '@oney/common-core';
import { SmoneyAddBeneficiaryResponse } from '../partners/smoney/models/user/SmoneyAddBeneficiaryResponse';

type AddBeneficiarySourceData = {
  response: SmoneyAddBeneficiaryResponse;
  email: string;
};

export class SmoneyAddBeneficiaryMapper implements Mapper<BeneficiaryProperties, AddBeneficiarySourceData> {
  toDomain(data: AddBeneficiarySourceData): BeneficiaryProperties {
    const { response, email } = data;
    return {
      id: response.Id,
      bic: response.Bic,
      email,
      name: response.DisplayName,
      status: response.Status,
      iban: response.Iban,
    };
  }
}
