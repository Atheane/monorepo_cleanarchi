import { injectable, inject } from 'inversify';
import { PaymentScheduleService } from '@oney/credit-core';
import { Identifiers } from '../../di/Identifiers';
import { AzureStorageBlob } from '../fileStorage';

@injectable()
export class GetPaymentScheduleService implements PaymentScheduleService {
  constructor(
    @inject(Identifiers.fileStorage)
    private readonly azureStorageBlob: AzureStorageBlob,
  ) {}

  async getPaymentScheduleService(file: string): Promise<Buffer> {
    return this.azureStorageBlob.getFile(file);
  }
}
