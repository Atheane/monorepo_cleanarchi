import { injectable, inject } from 'inversify';
import { AccountStatementService, PfmIdentifiers } from '@oney/pfm-core';
import { AzureStorageBlob } from '../fileStorage';

@injectable()
export class GetAccountStatementService implements AccountStatementService {
  constructor(@inject(PfmIdentifiers.fileStorage) private readonly azureStorageBlob: AzureStorageBlob) {}

  async getAccountStatement(file: string): Promise<Buffer> {
    return this.azureStorageBlob.getFile(file);
  }
}
