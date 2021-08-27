import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../../Identifiers';
import { StorageGateway } from '../../domain/gateways/StorageGateway';
import { ProfileCoreConfiguration } from '../../domain/types/config/profileCoreConfiguration';
import { DocumentErrors } from '../../domain/models/DocumentError';

export interface GetTopicsCommand {
  versionNumber?: string;
}

@injectable()
export class GetCustomerServiceTopics implements Usecase<GetTopicsCommand, Buffer> {
  constructor(
    @inject(Identifiers.storageGateway) private readonly fileStorageGateway: StorageGateway,
    private readonly config: ProfileCoreConfiguration,
  ) {}

  async execute(request: GetTopicsCommand): Promise<Buffer> {
    try {
      const fileName = `customer_service_topics_${
        request.versionNumber || this.config.customerServiceTopicsVersion
      }.json`;
      return await this.fileStorageGateway.getDocument(fileName);
    } catch (e) {
      if (e.statusCode === 404) {
        throw new DocumentErrors.DocumentNotFound('DOCUMENT_NOT_FOUND');
      }
      throw e;
    }
  }
}
