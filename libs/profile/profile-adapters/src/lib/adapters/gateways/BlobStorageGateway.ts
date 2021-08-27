import { StorageGateway } from '@oney/profile-core';
import { ContainerClient } from '@azure/storage-blob';
import { injectable } from 'inversify';

@injectable()
export class BlobStorageGateway implements StorageGateway {
  constructor(private readonly _containerClient: ContainerClient) {}

  async storeDocument(name: string, file: any): Promise<string> {
    const blobClient = this._containerClient.getBlobClient(name);
    const blockBlobClient = blobClient.getBlockBlobClient();
    let blobOptions = {};
    if (file.mimetype) blobOptions = { blobHTTPHeaders: { blobContentType: file.mimetype } };
    await blockBlobClient.upload(file.buffer, Buffer.byteLength(file.buffer), blobOptions);
    return Promise.resolve(name);
  }

  async getDocument(fileName: string): Promise<Buffer> {
    const blobClient = this._containerClient.getBlobClient(fileName);
    const downloadBlockBlobResponse = await blobClient.download(0);
    const chunks = [];
    for await (const chunk of downloadBlockBlobResponse.readableStreamBody) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }
}
