import { defaultLogger } from '@oney/logger-adapters';
import { injectable, inject } from 'inversify';
import {
  AggregationIdentifier,
  FileStorageService,
  IAppConfiguration,
  TermsError,
} from '@oney/aggregation-core';
import { BlobServiceClient, ContainerClient, BlobClient } from '@azure/storage-blob';

@injectable()
export class BlobFileStorageService implements FileStorageService {
  private readonly serviceClient: BlobServiceClient;
  private readonly containerClient: ContainerClient;

  constructor(
    @inject(AggregationIdentifier.appConfiguration) private readonly appConfiguration: IAppConfiguration,
  ) {
    this.serviceClient = BlobServiceClient.fromConnectionString(
      this.appConfiguration.blobStorageConfiguration.connectionString,
    );
    this.containerClient = this.serviceClient.getContainerClient(
      this.appConfiguration.blobStorageConfiguration.containerName,
    );
  }

  async getFile(name: string): Promise<string> {
    try {
      const blobClient: BlobClient = this.containerClient.getBlobClient(name);
      // this will prevent data corruption for json file
      // some insight in this article: https://github.com/Azure/azure-sdk-for-js/issues/6411
      await blobClient.setHTTPHeaders({ blobContentEncoding: 'utf-8' });
      const downloadBlockBlobResponse = await blobClient.download(0);
      const chunks = [];
      for await (const chunk of downloadBlockBlobResponse.readableStreamBody) {
        chunks.push(chunk.toString());
      }
      return chunks.join('');
    } catch (e) {
      defaultLogger.error('@oney/aggregation.BlobFileStorageService.getFile.catch', {
        name: e.name,
        statusCode: e.statusCode,
      });
      throw new TermsError.DocumentNotFound();
    }
  }
}
