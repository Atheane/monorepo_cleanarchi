import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { FileStorage, IAzureBlobStorageConfiguration } from '@oney/pfm-core';

export class AzureStorageBlob implements FileStorage {
  private readonly serviceClient: BlobServiceClient;

  private readonly containerClient: ContainerClient;

  constructor(private readonly azureBlobStorageConfiguration: IAzureBlobStorageConfiguration) {
    this.azureBlobStorageConfiguration = azureBlobStorageConfiguration;

    this.serviceClient = BlobServiceClient.fromConnectionString(
      this.azureBlobStorageConfiguration.connectionString,
    );
    this.containerClient = this.serviceClient.getContainerClient(
      this.azureBlobStorageConfiguration.containerName,
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
