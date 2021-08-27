import { Debt, DebtGateway, NetworkProvider, PaymentIdentifier } from '@oney/payment-core';
import { inject, injectable } from 'inversify';
import { SmoneyDebtMapper } from '../mappers/SmoneyDebtMapper';
import { SmoneyApi } from '../partners/smoney/SmoneyNetworkProvider';
import { SmoneyDebtRequest, SmoneyDebtResponse } from '../partners/smoney/api/SmoneyDebtApi';

@injectable()
export class SmoneyDebtGateway implements DebtGateway {
  constructor(
    @inject(PaymentIdentifier.networkProvider) private readonly _networkProvider: NetworkProvider<SmoneyApi>,
    @inject(SmoneyDebtMapper)
    private readonly _smoneyDebtMapper: SmoneyDebtMapper,
  ) {}

  async getDebtsBy(userId: string): Promise<Debt[]> {
    const request = { userId } as SmoneyDebtRequest;
    const smoneyDebts: SmoneyDebtResponse = await this._networkProvider.api().smoneyDebtApi.getAll(request);
    return smoneyDebts.value.map(anSmoneyDebt => this._smoneyDebtMapper.toDomain(anSmoneyDebt));
  }

  async updateRemainingAmount(debt: Debt): Promise<void> {
    const smoneyDebt = this._smoneyDebtMapper.fromDomain(debt);
    await this._networkProvider.api().smoneyDebtApi.updateRemaningAmount(smoneyDebt);
  }

  async updateStatus(debt: Debt): Promise<void> {
    const smoneyDebt = this._smoneyDebtMapper.fromDomain(debt);
    await this._networkProvider.api().smoneyDebtApi.updateStatus(smoneyDebt);
  }
}
