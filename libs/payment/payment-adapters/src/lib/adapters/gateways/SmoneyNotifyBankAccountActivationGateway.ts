import { injectable } from 'inversify';
import { BankAccountActivationGateway, NetworkProvider } from '@oney/payment-core';
import { SmoneyApi } from '../partners/smoney/SmoneyNetworkProvider';

@injectable()
export class SmoneyNotifyBankAccountActivationGateway implements BankAccountActivationGateway {
  constructor(private readonly _networkProvider: NetworkProvider<SmoneyApi>) {}

  async createComplimentaryDiligence(userId: string): Promise<void> {
    await this._networkProvider.api().smoneyKycApi.createComplementaryDiligence({ appUserId: userId });
  }
}
