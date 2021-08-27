import { defaultLogger } from '@oney/logger-adapters';
import { DocumentSide, DocumentType, KycDecisionDocument } from '@oney/profile-messages';
import { BlobServiceClient } from '@azure/storage-blob';
import { File, FileExtensions, IdTypes, KycDocument } from '@oney/payment-core';
import { BlobStorageGateway } from '../adapters/gateways/BlobStorageGateway';

jest.mock('@azure/storage-blob', () => ({
  BlobServiceClient: {
    fromConnectionString: jest.fn().mockReturnValue({
      getContainerClient: jest.fn().mockReturnValue({
        listBlobsFlat: jest.fn().mockReturnValue([
          {
            name: 'kyc/toto.jpg',
          },
        ]),
        getBlobClient: jest.fn().mockReturnValue({
          download: jest.fn().mockReturnValue({
            readableStreamBody: jest.fn(),
          }),
        }),
      }),
    }),
  },
}));

describe('BlobStorageGateway unit test', () => {
  const userId = 'beGe_flCm';
  const blobServiceClient = BlobServiceClient.fromConnectionString('azureBlobConnectionString');
  const blobContainerClient = blobServiceClient.getContainerClient('azureBlobContainerName');

  [
    {
      idTypes: IdTypes.RESIDENCE_BEFORE_2011_FRONT,
      documentType: DocumentType.RESIDENCE_PERMIT_BEFORE_2011,
      documentSide: DocumentSide.FRONT,
    },
    {
      idTypes: IdTypes.RESIDENCE_BEFORE_2011_BACK,
      documentType: DocumentType.RESIDENCE_PERMIT_BEFORE_2011,
      documentSide: DocumentSide.BACK,
    },
    {
      idTypes: IdTypes.RESIDENCE_AFTER_2011_BACK,
      documentType: DocumentType.RESIDENCE_PERMIT_AFTER_2011,
      documentSide: DocumentSide.BACK,
    },
    {
      idTypes: IdTypes.RESIDENCE_AFTER_2011_FRONT,
      documentType: DocumentType.RESIDENCE_PERMIT_AFTER_2011,
      documentSide: DocumentSide.FRONT,
    },
    {
      idTypes: IdTypes.ID_FRONT,
      documentType: DocumentType.ID_DOCUMENT,
      documentSide: DocumentSide.FRONT,
    },
    {
      idTypes: IdTypes.ID_BACK,
      documentType: DocumentType.ID_DOCUMENT,
      documentSide: DocumentSide.BACK,
    },
    {
      idTypes: IdTypes.PASSPORT,
      documentType: DocumentType.PASSPORT,
    },
  ].map(({ idTypes, documentType, documentSide }) => {
    it(`should return type ${idTypes} when DocumentType is ${documentType} and DocumentSide is ${documentSide}`, async () => {
      const blobStorageGateway = new BlobStorageGateway(blobContainerClient, defaultLogger);
      const document: KycDecisionDocument = {
        type: documentType,
        side: documentSide,
        location: '.jpg',
      };

      const result: KycDocument = await blobStorageGateway.getFiles(userId, [document]);

      const expectedResult: KycDocument = new KycDocument({
        uid: userId,
        files: [
          {
            type: idTypes,
            extString: FileExtensions.JPG,
            file: new Buffer(''),
          } as File,
        ],
      });
      expect(result.props).toEqual(expectedResult.props);
    });
  });

  it(`should return extString PDF when Document is a PDF`, async () => {
    const blobStorageGateway = new BlobStorageGateway(blobContainerClient, defaultLogger);
    const document: KycDecisionDocument = {
      type: DocumentType.PASSPORT,
      location: `${userId}/kyc/passport_1607558400000.pdf`,
    };

    const result: KycDocument = await blobStorageGateway.getFiles(userId, [document]);

    const expectedResult: KycDocument = new KycDocument({
      uid: userId,
      files: [
        {
          type: IdTypes.PASSPORT,
          extString: FileExtensions.PDF,
          file: new Buffer(''),
        } as File,
      ],
    });
    expect(result.props).toEqual(expectedResult.props);
  });
});
