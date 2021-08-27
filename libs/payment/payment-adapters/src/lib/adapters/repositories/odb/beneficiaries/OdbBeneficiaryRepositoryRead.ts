import {
  Beneficiary,
  BeneficiaryRepositoryRead,
  PaymentIdentifier,
  BankAccountRepositoryRead,
  BeneficiaryError,
} from '@oney/payment-core';
import { inject, injectable } from 'inversify';

@injectable()
export class OdbBeneficiaryRepositoryRead implements BeneficiaryRepositoryRead {
  constructor(
    @inject(PaymentIdentifier.bankAccountRepositoryRead)
    private readonly _bankAccountRepositoryRead: BankAccountRepositoryRead,
  ) {}

  async getById(bankAccountId: string, id: string): Promise<Beneficiary> {
    const bankAccount = await this._bankAccountRepositoryRead.findById(bankAccountId);
    const beneficiary = bankAccount.props.beneficiaries.find(item => item.id === id);
    if (!beneficiary) {
      throw new BeneficiaryError.BeneficiaryNotFound('BENEFICIARY_NOT_FOUND');
    }
    return beneficiary;
  }
}
