import { Mapper } from '@oney/common-core';
import { Beneficiary } from '@oney/payment-core';
import { injectable } from 'inversify';
import { BeneficiaryDTO } from '../dto/BeneficiaryDTO';

@injectable()
export class BeneficiaryMapper implements Mapper<Beneficiary, BeneficiaryDTO> {
  fromDomain(raw: Beneficiary): BeneficiaryDTO {
    return { ...raw.props };
  }
}
