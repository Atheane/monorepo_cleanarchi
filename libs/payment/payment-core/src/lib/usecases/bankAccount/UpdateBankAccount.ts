import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { DeclarativeFiscalSituation, FiscalReference } from '@oney/profile-messages';
import { PaymentIdentifier } from '../../PaymentIdentifier';
import { BankAccountGateway } from '../../domain/gateways/BankAccountGateway';

export interface UpdateBankAccountRequest {
  uid: string;
  phone?: string;
  declarativeFiscalSituation?: DeclarativeFiscalSituation;
  fiscalReference?: FiscalReference;
}

@injectable()
export class UpdateBankAccount implements Usecase<UpdateBankAccountRequest, void> {
  constructor(
    @inject(PaymentIdentifier.bankAccountGateway)
    private readonly bankAccountGateway: BankAccountGateway,
  ) {}

  async execute(request: UpdateBankAccountRequest): Promise<void> {
    const { uid, phone, fiscalReference, declarativeFiscalSituation } = request;

    if (phone) {
      await this.bankAccountGateway.updateBankAccount(uid, { phone });
    }

    if (request.fiscalReference) {
      await this.bankAccountGateway.updateFatca(request.uid, fiscalReference);
    }

    if (request.declarativeFiscalSituation) {
      await this.bankAccountGateway.updateDeclarativeFiscalSituation(request.uid, declarativeFiscalSituation);
    }
  }
}
