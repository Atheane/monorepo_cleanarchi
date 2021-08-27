import { NetworkProvider, Transfer, TransferRepositoryWrite } from '@oney/payment-core';
import { injectable } from 'inversify';
import { SmoneyTransferMapper } from '../../mappers/SmoneyTransferMapper';
import { SmoneyApi } from '../../partners/smoney/SmoneyNetworkProvider';

@injectable()
export class SmoneyTransferRepository implements TransferRepositoryWrite {
  constructor(private readonly _networkProvider: NetworkProvider<SmoneyApi>) {}

  async create(senderUid: string, transfer: Transfer, reason?: string): Promise<Transfer> {
    const transferRequest = new SmoneyTransferMapper().fromDomain(transfer, reason);
    await this._networkProvider
      .api()
      .smoneyTransferApi.makeTransfer({ ...transferRequest, Accountid: { AppAccountId: senderUid } });
    return transfer;
  }
}
