import {
  BankAccount,
  BankAccountExposureGateway,
  NetworkProvider,
  PaymentIdentifier,
} from '@oney/payment-core';
import { inject, injectable } from 'inversify';
import { SmoneyApi } from '../partners/smoney/SmoneyNetworkProvider';

@injectable()
export class SmoneyBankAccountExposureGateway implements BankAccountExposureGateway {
  constructor(
    @inject(PaymentIdentifier.networkProvider) private readonly _networkProvider: NetworkProvider<SmoneyApi>,
  ) {}

  async updateBankAccountExposure({ props }: BankAccount): Promise<void> {
    const { uid, exposure } = props;
    return this._networkProvider.api().smoneyExposureApi.updateExposure(uid, exposure.amount * 100);
  }
}
