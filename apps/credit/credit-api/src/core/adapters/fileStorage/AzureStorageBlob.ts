import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { FileStorage, IAppConfiguration } from '@oney/credit-core';
import { getAppConfiguration } from '../../../config/app/AppConfigurationService';

export class AzureStorageBlob implements FileStorage {
  private readonly serviceClient: BlobServiceClient;

  private readonly config: IAppConfiguration;

  private readonly containerClient: ContainerClient;

  constructor() {
    this.config = getAppConfiguration();

    this.serviceClient = BlobServiceClient.fromConnectionString(
      this.config.azureBlobStorageConfiguration.connectionString,
    );
    this.containerClient = this.serviceClient.getContainerClient(
      this.config.azureBlobStorageConfiguration.containerName,
    );
  }

  async getFile(name: string): Promise<Buffer> {
    const blobClient = this.containerClient.getBlobClient(name);
    const downloadBlockBlobResponse = await blobClient.download();
    const chunks = [];
    for await (const chunk of downloadBlockBlobResponse.readableStreamBody) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  }
}
