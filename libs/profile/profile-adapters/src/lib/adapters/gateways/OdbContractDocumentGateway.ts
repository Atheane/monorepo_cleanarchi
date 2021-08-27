import { injectable } from 'inversify';
import {
  ContractDocumentGateway,
  StorageGateway,
  ProfileCoreConfiguration,
  Profile,
} from '@oney/profile-core';
import { Body, AbstractDocumentGenerator, Settings, Footer } from '@oney/document-generator';
import { ContractDocumentRequestMapper } from '../mappers/ContractDocumentRequestMapper';

@injectable()
export class OdbContractDocumentGateway implements ContractDocumentGateway {
  constructor(
    private readonly _config: ProfileCoreConfiguration,
    private readonly _documentGenerator: AbstractDocumentGenerator,
    private readonly _storageGateway: StorageGateway,
    private readonly _contractDocumentRequestMapper: ContractDocumentRequestMapper,
  ) {}

  async createAndSave(profile: Profile): Promise<string> {
    const payload = this._contractDocumentRequestMapper.fromDomain(profile);
    const settings: Settings = { body: Body.CONTRAT, footer: Footer.CONTRAT };
    const path = `${payload.uid}${this._config.odbContractPath}`;
    const { odbProfileBlobStorageCs, blobStorageContainerName } = this._config;
    (await this._documentGenerator.generate(payload, settings)).save(
      path,
      odbProfileBlobStorageCs,
      blobStorageContainerName,
    );
    return path;
  }

  async create(profile: Profile): Promise<Buffer> {
    const contractDocumentRequest = this._contractDocumentRequestMapper.fromDomain(profile);
    const contractDocument = await this._documentGenerator.generate(contractDocumentRequest, {
      body: Body.CONTRAT,
      footer: Footer.CONTRAT,
    });

    return contractDocument.getData;
  }

  async get(uid: string): Promise<Buffer> {
    return await this._storageGateway.getDocument(`${uid}${this._config.odbContractPath}`);
  }
}
