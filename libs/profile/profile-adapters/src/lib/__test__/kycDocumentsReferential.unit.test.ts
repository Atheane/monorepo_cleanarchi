import { DocumentSide, DocumentType, ProfileErrors } from '@oney/profile-core';
import { CountryCode } from '@oney/profile-messages';
import { KycDocumentsReferentialGateway } from '../adapters/gateways/KycDocumentsReferentialGateway';

describe('kycDocumentsReferential unit test', () => {
  it('should return document config file document found', () => {
    const kycDocumentsReferentialGateway = new KycDocumentsReferentialGateway();
    const result = kycDocumentsReferentialGateway.getKycDocumentConf(
      CountryCode.FR,
      DocumentType.ID_DOCUMENT,
      DocumentSide.FRONT,
    );

    expect(result).toEqual({
      documentSide: 'front',
      elementCategory: 'IDENTITY',
      elementSubCategory: 'I-FRA-F',
      elementType: 1,
    });
  });

  it('should throw exception when nationality is not found', () => {
    const kycDocumentsReferentialGateway = new KycDocumentsReferentialGateway();

    expect(() => {
      kycDocumentsReferentialGateway.getKycDocumentConf(
        'NON-EXISTENT-NATIONALITY' as CountryCode,
        DocumentType.ID_DOCUMENT,
        DocumentSide.FRONT,
      );
    }).toThrow(ProfileErrors.IncorrectIdentityDocumentError);
  });
});
