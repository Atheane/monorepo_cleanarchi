import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { PaymentIdentifier } from '../../PaymentIdentifier';
import { BankAccount } from '../../domain/aggregates/BankAccount';
import { BankAccountGateway } from '../../domain/gateways/BankAccountGateway';
import { BankAccountRepositoryRead } from '../../domain/repository/bankAccounts/BankAccountRepositoryRead';
import { BankAccountRepositoryWrite } from '../../domain/repository/bankAccounts/BankAccountRepositoryWrite';

export interface UpdateAllowanceRequest {
  uid: string;
}

@injectable()
export class UpdateMonthlyAllowance implements Usecase<UpdateAllowanceRequest, BankAccount> {
  constructor(
    @inject(PaymentIdentifier.bankAccountRepositoryRead)
    private readonly _bankAccountRepositoryRead: BankAccountRepositoryRead,
    @inject(PaymentIdentifier.bankAccountRepositoryWrite)
    private readonly _bankAccountRepositoryWrite: BankAccountRepositoryWrite,
    @inject(PaymentIdentifier.bankAccountGateway) private readonly _bankAccountGateway: BankAccountGateway,
  ) {}

  async execute(request: UpdateAllowanceRequest): Promise<BankAccount> {
    const bankAccount = await this._bankAccountRepositoryRead.findById(request.uid);

    const {
      monthlyUsedAllowance,
      authorizedAllowance,
      remainingFundToSpend,
    } = await this._bankAccountGateway.getCalculatedMonthlyAllowance(request.uid);
    bankAccount.updateMonthlyAllowance({ authorizedAllowance, remainingFundToSpend }, monthlyUsedAllowance);

    await this._bankAccountRepositoryWrite.save(bankAccount);
    return bankAccount;
  }
}
