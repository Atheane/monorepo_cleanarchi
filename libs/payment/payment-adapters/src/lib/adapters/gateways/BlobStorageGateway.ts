import { ContainerClient } from '@azure/storage-blob';
import { Logger, SymLogger } from '@oney/logger-core';
import { File, FileExtensions, IdTypes, KycDocument, KycError, StorageGateway } from '@oney/payment-core';
import { inject, injectable } from 'inversify';
// TODO : Add a proper ACL here
import { KycDecisionDocument } from '@oney/profile-messages';

@injectable()
export class BlobStorageGateway implements StorageGateway {
  constructor(
    private readonly _containerClient: ContainerClient,
    @inject(SymLogger) private readonly _logger: Logger,
  ) {}

  async getFiles(userId: string, documents: KycDecisionDocument[]): Promise<KycDocument> {
    const userDocuments: File[] = [];
    for await (const document of documents) {
      const type = document.side
        ? (`${document.type}-${document.side}` as IdTypes)
        : (`${document.type}` as IdTypes);
      const extString = document.location.split('.')[1] as FileExtensions;
      const file = await this._getFileFromFilename(document.location);
      if (file) {
        userDocuments.push({
          type,
          extString,
          file,
        });
      }
    }

    if (userDocuments.length === 0) {
      throw new KycError.DocumentNotFound('DOCUMENT_NOT_FOUND');
    }

    return new KycDocument({
      uid: userId,
      files: userDocuments,
    });
  }

  async getBankIdentityStatement(uid: string, bankAccountId: string): Promise<Buffer> {
    return this._getFileFromFilename(`bis/${uid}/${bankAccountId}.pdf`);
  }

  private async _getFileFromFilename(fileName: string): Promise<Buffer> {
    try {
      const blobClient = await this._containerClient.getBlobClient(fileName);
      const downloadBlockBlobResponse = await blobClient.download();
      const chunks = [];
      for await (const chunk of downloadBlockBlobResponse.readableStreamBody) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    } catch (e) {
      this._logger.info(`Error when getting file in storage`, e);
      return null;
    }
  }
}
