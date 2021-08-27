import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { PaymentIdentifier } from '../../PaymentIdentifier';
import { BankAccountBalanceGateway } from '../../domain/gateways/BankAccountBalanceGateway';
import { AccountBalance } from '../../domain/types/AccountBalance';

export interface GetBalanceRequest {
  uid: string;
}

@injectable()
export class GetBalance implements Usecase<GetBalanceRequest, AccountBalance> {
  constructor(
    @inject(PaymentIdentifier.bankAccountBalanceGateway)
    private readonly bankAccountBalanceGateway: BankAccountBalanceGateway,
  ) {}

  async execute(request: GetBalanceRequest): Promise<AccountBalance> {
    const accountBalance = await this.bankAccountBalanceGateway.getBalance(request.uid);

    return accountBalance;
  }
}
