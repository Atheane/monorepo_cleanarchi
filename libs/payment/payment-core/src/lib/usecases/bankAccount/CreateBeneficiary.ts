import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { BankAccountGateway, BeneficiaryProperties } from '@oney/payment-core';
import { Authorization, CanExecuteResult, Identity, ServiceName } from '@oney/identity-core';
import { inject, injectable } from 'inversify';
import { PaymentIdentifier } from '../../PaymentIdentifier';
import { BankAccountRepositoryRead } from '../../domain/repository/bankAccounts/BankAccountRepositoryRead';
import { ScaActions } from '../../models/ScaActions';

export class CreateBeneficiaryRequest {
  uid: string;

  bic: string;

  name: string;

  email: string;

  iban: string;
}

@injectable()
export class CreateBeneficiary implements Usecase<CreateBeneficiaryRequest, BeneficiaryProperties> {
  constructor(
    @inject(PaymentIdentifier.bankAccountGateway) private readonly _bankAccountGateway: BankAccountGateway,
    @inject(PaymentIdentifier.bankAccountRepositoryRead)
    private readonly _bankAccountRepositoryRead: BankAccountRepositoryRead,
    @inject(EventProducerDispatcher) private readonly _eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: CreateBeneficiaryRequest): Promise<BeneficiaryProperties> {
    const { uid, bic, name, email, iban } = request;
    const bankAccount = await this._bankAccountRepositoryRead.findById(request.uid);

    const beneficiaryProperties = await this._bankAccountGateway.addBeneficiary(uid, {
      bic,
      name,
      email,
      iban,
    });
    const beneficiary = bankAccount.addBeneficiary(beneficiaryProperties);

    await this._eventDispatcher.dispatch(bankAccount);
    return beneficiary.props;
  }

  async canExecute(identity: Identity, request?: CreateBeneficiaryRequest): Promise<CanExecuteResult> {
    const roles = identity.roles.find(item => item.scope.name === ServiceName.payment);

    if (roles.permissions.write === Authorization.self) {
      return CanExecuteResult.sca_needed({
        payload: request,
        actionType: ScaActions.ADD_BENEFICIARY,
      });
    }

    return CanExecuteResult.cannot();
  }
}
