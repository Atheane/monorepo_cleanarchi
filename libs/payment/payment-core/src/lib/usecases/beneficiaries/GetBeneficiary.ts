import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { PaymentIdentifier } from '../../PaymentIdentifier';
import { Beneficiary } from '../../domain/entities/Beneficiary';
import { BeneficiaryRepositoryRead } from '../../domain/repository/beneficiaries/BeneficiaryRepositoryRead';

export interface GetBeneficiaryRequest {
  uid: string;
  beneficiaryId: string;
}

@injectable()
export class GetBeneficiary implements Usecase<GetBeneficiaryRequest, Beneficiary> {
  constructor(
    @inject(PaymentIdentifier.beneficiaryRepositoryRead)
    private readonly _beneficiaryRepositoryRead: BeneficiaryRepositoryRead,
  ) {}

  async execute(request: GetBeneficiaryRequest): Promise<Beneficiary> {
    return await this._beneficiaryRepositoryRead.getById(request.uid, request.beneficiaryId);
  }
}
