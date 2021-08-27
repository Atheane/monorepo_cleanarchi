import { KycDocument, KycGateway, PaymentIdentifier, KycFilters } from '@oney/payment-core';
import { inject, injectable } from 'inversify';
import { SmoneyKycDocumentMapper } from '../mappers/SmoneyKycDocumentMapper';
import { SmoneyKycFiltersMapper } from '../mappers/SmoneyKycFiltersMapper';
import { SmoneyNetworkProvider } from '../partners/smoney/SmoneyNetworkProvider';

@injectable()
export class SmoneyKycGateway implements KycGateway {
  private readonly _smoneyKycDocumentMapper: SmoneyKycDocumentMapper;
  private readonly _smoneyKycFiltersMapper: SmoneyKycFiltersMapper;

  constructor(
    @inject(PaymentIdentifier.networkProvider) private readonly _networkProvider: SmoneyNetworkProvider,
  ) {
    this._smoneyKycDocumentMapper = new SmoneyKycDocumentMapper();
    this._smoneyKycFiltersMapper = new SmoneyKycFiltersMapper();
  }

  async createDocument(document: KycDocument): Promise<KycDocument> {
    const kycRequest = this._smoneyKycDocumentMapper.fromDomain(document);
    const smoneyKycResponse = await this._networkProvider.api().smoneyKycApi.sendDocument(kycRequest);
    return this._smoneyKycDocumentMapper.toDomain({ ...smoneyKycResponse, uid: document.id });
  }

  async setFilters(kycValues: KycFilters): Promise<void> {
    const filtersRequest = this._smoneyKycFiltersMapper.fromDomain(kycValues);
    await this._networkProvider.api().smoneyKycApi.setFilters(filtersRequest);
  }
}
