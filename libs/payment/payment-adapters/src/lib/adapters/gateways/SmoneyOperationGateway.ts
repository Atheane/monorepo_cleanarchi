import {
  OperationGateway,
  NetworkProvider,
  GetCOPPayload,
  OperationProperties,
  Clearing,
  GetSingleClearingPayload,
  IdGenerator,
} from '@oney/payment-core';
import { SmoneyApi } from '../partners/smoney/SmoneyNetworkProvider';
import { SmoneySDDMapper } from '../mappers/SmoneySDDMapper';
import { SmoneyCOPMapper } from '../mappers/SmoneyCOPMapper';
import { SmoneyClearingBatchMapper } from '../mappers/SmoneyClearingBatchMapper';
import { SmoneyClearingMapper } from '../mappers/SmoneyClearingMapper';

export class SmoneyOperationGateway implements OperationGateway {
  private readonly _smoneySDDMapper: SmoneySDDMapper;
  private readonly _smoneyCOPMapper: SmoneyCOPMapper;
  private readonly _smoneyClearingBatchMapper: SmoneyClearingBatchMapper;
  private readonly _smoneyClearingMapper: SmoneyClearingMapper;

  constructor(
    private readonly _networkProvider: NetworkProvider<SmoneyApi>,
    private readonly _tidGenerator: IdGenerator,
  ) {
    this._smoneySDDMapper = new SmoneySDDMapper();
    this._smoneyCOPMapper = new SmoneyCOPMapper();
    this._smoneyClearingBatchMapper = new SmoneyClearingBatchMapper();
    this._smoneyClearingMapper = new SmoneyClearingMapper();
  }

  async getSDD(reference: string): Promise<OperationProperties> {
    const request = { reference };
    const sddDetails = await this._networkProvider.api().smoneyOperationApi.getSDDDetails(request);
    return this._smoneySDDMapper.toDomain({ raw: sddDetails, tid: this._tidGenerator.generateUniqueID() });
  }

  async getCOP(getCOPPayload: GetCOPPayload): Promise<OperationProperties> {
    const copDetails = await this._networkProvider
      .api()
      .smoneyOperationApi.getCOPDetails({ reference: getCOPPayload.reference });
    return this._smoneyCOPMapper.toDomain({
      raw: copDetails,
      getCOPPayload: { tid: this._tidGenerator.generateUniqueID(), ...getCOPPayload },
    });
  }

  async getClearings(reference: string): Promise<Clearing[]> {
    const clearingBatch = await this._networkProvider
      .api()
      .smoneyOperationApi.getClearingBatchDetails({ reference });
    return clearingBatch.clearings.map(clearing => this._smoneyClearingBatchMapper.toDomain(clearing));
  }

  async getSingleClearing(getSingleClearingPayload: GetSingleClearingPayload): Promise<OperationProperties> {
    const clearingDetails = await this._networkProvider
      .api()
      .smoneyOperationApi.getCOPDetails({ reference: getSingleClearingPayload.reference });
    return this._smoneyClearingMapper.toDomain({
      raw: clearingDetails,
      getSingleClearingPayload: { tid: this._tidGenerator.generateUniqueID(), ...getSingleClearingPayload },
    });
  }
}
