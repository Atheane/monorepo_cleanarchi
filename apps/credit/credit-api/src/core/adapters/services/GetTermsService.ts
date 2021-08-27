import { injectable, inject } from 'inversify';
import { TermsService } from '@oney/credit-core';
import { Identifiers } from '../../di/Identifiers';
import { AzureStorageBlob } from '../fileStorage';

@injectable()
export class GetTermsService implements TermsService {
  constructor(@inject(Identifiers.fileStorage) private readonly azureStorageBlob: AzureStorageBlob) {}

  async getTerms(file: string): Promise<Buffer> {
    return this.azureStorageBlob.getFile(file);
  }
}
