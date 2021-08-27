import {
  BankAccountBalanceGateway,
  AccountBalance,
  NetworkProvider,
  PaymentIdentifier,
} from '@oney/payment-core';
import { inject, injectable } from 'inversify';
import { BankAccountBalanceMapper } from '../mappers/BankAccountBalanceMapper';
import { SmoneyApi } from '../partners/smoney/SmoneyNetworkProvider';

@injectable()
export class SmoneyAccountBalanceGateway implements BankAccountBalanceGateway {
  constructor(
    @inject(PaymentIdentifier.networkProvider) private readonly _networkProvider: NetworkProvider<SmoneyApi>,
  ) {}

  async getBalance(uid: string): Promise<AccountBalance> {
    const bankAccountBalanceMapper = new BankAccountBalanceMapper();
    const data = await this._networkProvider.api().smoneyUserApi.getUserInfos({ appUserId: uid });
    return bankAccountBalanceMapper.toDomain(data);
  }
}
