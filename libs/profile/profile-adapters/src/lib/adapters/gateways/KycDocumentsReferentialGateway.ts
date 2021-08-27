import { DocumentSide, DocumentType, ProfileErrors } from '@oney/profile-core';
import { CountryCode } from '@oney/profile-messages';
import { DocumentsReferentialGateway } from '@oney/profile-core';
import { KycDocumentReferential } from '@oney/profile-core';
import { injectable } from 'inversify';

@injectable()
export class KycDocumentsReferentialGateway implements DocumentsReferentialGateway {
  getKycDocumentConf(nationality: CountryCode, documentType: DocumentType, documentSide?: DocumentSide) {
    const documentConfig = this.getReferential()
      .find(item => item.aliases.alpha2 === nationality.valueOf())
      ?.documents[documentType]?.find(item => item.documentSide === documentSide?.valueOf());
    if (!documentConfig) throw new ProfileErrors.IncorrectIdentityDocumentError();
    return documentConfig;
  }

  getReferential(): KycDocumentReferential[] {
    return referential;
  }
}

const referential: KycDocumentReferential[] = [
  {
    aliases: {
      fullname: 'Afghanistan',
      alpha2: CountryCode.AF,
      alpha3: 'AFG',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-AFG-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-AFG-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-AFG-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-AFG-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-AFG-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Afrique du Sud',
      alpha2: CountryCode.ZA,
      alpha3: 'ZAF',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-ZAF-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ZAF-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ZAF-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ZAF-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ZAF-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Albanie',
      alpha2: CountryCode.AL,
      alpha3: 'ALB',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-ALB-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-ALB-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-ALB-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ALB-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ALB-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ALB-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ALB-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Algérie',
      alpha2: CountryCode.DZ,
      alpha3: 'DZA',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-DZA-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-DZA-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-DZA-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-DZA-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-DZA-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Allemagne',
      alpha2: CountryCode.DE,
      alpha3: 'DEU',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-DEU-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-DEU-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-DEU-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-DEU-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-DEU-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-DEU-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-DEU-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Andorre',
      alpha2: CountryCode.AD,
      alpha3: 'AND',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-AND-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-AND-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-AND-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-AND-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-AND-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Angola',
      alpha2: CountryCode.AO,
      alpha3: 'AGO',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-AGO-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-AGO-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-AGO-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-AGO-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-AGO-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Anguilla',
      alpha2: CountryCode.AI,
      alpha3: 'AIA',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-AIA-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-AIA-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-AIA-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-AIA-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-AIA-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Antigua-et-Barbuda',
      alpha2: CountryCode.AG,
      alpha3: 'ATG',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-ATG-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ATG-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ATG-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ATG-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ATG-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Arabie saoudite',
      alpha2: CountryCode.SA,
      alpha3: 'SAU',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-SAU-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SAU-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SAU-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SAU-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SAU-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Argentine',
      alpha2: CountryCode.AR,
      alpha3: 'ARG',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-ARG-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ARG-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ARG-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ARG-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ARG-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Arménie',
      alpha2: CountryCode.AM,
      alpha3: 'ARM',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-ARM-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ARM-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ARM-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ARM-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ARM-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Aruba',
      alpha2: CountryCode.AW,
      alpha3: 'ABW',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-ABW-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ABW-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ABW-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ABW-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ABW-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Australie',
      alpha2: CountryCode.AU,
      alpha3: 'AUS',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-AUS-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-AUS-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-AUS-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-AUS-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-AUS-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Autriche',
      alpha2: CountryCode.AT,
      alpha3: 'AUT',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-AUT-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-AUT-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-AUT-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-AUT-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-AUT-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-AUT-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-AUT-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Azerbaïdjan',
      alpha2: CountryCode.AZ,
      alpha3: 'AZE',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-AZE-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-AZE-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-AZE-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-AZE-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-AZE-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Bahamas',
      alpha2: CountryCode.BS,
      alpha3: 'BHS',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-BHS-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BHS-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BHS-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BHS-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BHS-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Bahreïn',
      alpha2: CountryCode.BH,
      alpha3: 'BHR',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-BHR-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BHR-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BHR-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BHR-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BHR-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Bangladesh',
      alpha2: CountryCode.BD,
      alpha3: 'BGD',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-BGD-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BGD-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BGD-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BGD-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BGD-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Barbade',
      alpha2: CountryCode.BB,
      alpha3: 'BRB',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-BRB-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BRB-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BRB-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BRB-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BRB-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Bélarus',
      alpha2: CountryCode.BY,
      alpha3: 'BLR',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-BLR-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BLR-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BLR-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BLR-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BLR-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Belgique',
      alpha2: CountryCode.BE,
      alpha3: 'BEL',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-BEL-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-BEL-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-BEL-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BEL-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BEL-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BEL-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BEL-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Belize',
      alpha2: CountryCode.BZ,
      alpha3: 'BLZ',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-BLZ-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BLZ-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BLZ-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BLZ-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BLZ-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Bénin',
      alpha2: CountryCode.BJ,
      alpha3: 'BEN',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-BEN-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BEN-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BEN-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BEN-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BEN-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Bhoutan',
      alpha2: CountryCode.BT,
      alpha3: 'BTN',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-BTN-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BTN-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BTN-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BTN-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BTN-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Bolivie (État plurinational de)',
      alpha2: CountryCode.BO,
      alpha3: 'BOL',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-BOL-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BOL-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BOL-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BOL-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BOL-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Bosnie-Herzégovine',
      alpha2: CountryCode.BA,
      alpha3: 'BIH',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-BIH-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-BIH-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-BIH-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BIH-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BIH-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BIH-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BIH-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Botswana',
      alpha2: CountryCode.BW,
      alpha3: 'BWA',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-BWA-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BWA-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BWA-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BWA-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BWA-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Brésil',
      alpha2: CountryCode.BR,
      alpha3: 'BRA',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-BRA-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BRA-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BRA-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BRA-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BRA-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Brunéi Darussalam',
      alpha2: CountryCode.BN,
      alpha3: 'BRN',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-BRN-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BRN-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BRN-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BRN-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BRN-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Bulgarie',
      alpha2: CountryCode.BG,
      alpha3: 'BGR',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-BGR-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-BGR-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-BGR-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BGR-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BGR-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BGR-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BGR-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Burkina Faso',
      alpha2: CountryCode.BF,
      alpha3: 'BFA',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-BFA-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BFA-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BFA-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BFA-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BFA-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Burundi',
      alpha2: CountryCode.BI,
      alpha3: 'BDI',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-BDI-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BDI-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BDI-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BDI-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-BDI-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Cabo Verde',
      alpha2: CountryCode.CV,
      alpha3: 'CPV',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-CPV-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CPV-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CPV-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CPV-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CPV-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Cambodge',
      alpha2: CountryCode.KH,
      alpha3: 'KHM',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-KHM-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-KHM-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-KHM-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-KHM-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-KHM-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Cameroun',
      alpha2: CountryCode.CM,
      alpha3: 'CMR',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-CMR-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CMR-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CMR-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CMR-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CMR-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Canada',
      alpha2: CountryCode.CA,
      alpha3: 'CAN',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-CAN-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CAN-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CAN-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CAN-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CAN-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Chili',
      alpha2: CountryCode.CL,
      alpha3: 'CHL',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-CHL-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CHL-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CHL-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CHL-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CHL-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Chine',
      alpha2: CountryCode.CN,
      alpha3: 'CHN',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-CHN-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CHN-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CHN-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CHN-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CHN-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Chypre',
      alpha2: CountryCode.CY,
      alpha3: 'CYP',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-CYP-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CYP-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CYP-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CYP-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CYP-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Colombie',
      alpha2: CountryCode.CO,
      alpha3: 'COL',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-COL-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-COL-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-COL-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-COL-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-COL-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Comores',
      alpha2: CountryCode.KM,
      alpha3: 'COM',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-COM-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-COM-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-COM-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-COM-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-COM-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Congo (le)',
      alpha2: CountryCode.CG,
      alpha3: 'COG',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-COG-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-COG-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-COG-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-COG-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-COG-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Costa Rica',
      alpha2: CountryCode.CR,
      alpha3: 'CRI',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-CRI-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CRI-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CRI-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CRI-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CRI-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: "Côte d'Ivoire",
      alpha2: CountryCode.CI,
      alpha3: 'CIV',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-CIV-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CIV-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CIV-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CIV-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CIV-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Croatie',
      alpha2: CountryCode.HR,
      alpha3: 'HRV',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-HRV-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-HRV-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-HRV-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-HRV-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-HRV-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-HRV-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-HRV-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Cuba',
      alpha2: CountryCode.CU,
      alpha3: 'CUB',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-CUB-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CUB-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CUB-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CUB-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CUB-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Curaçao',
      alpha2: CountryCode.CW,
      alpha3: 'CUW',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-CUW-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CUW-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CUW-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CUW-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CUW-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Danemark',
      alpha2: CountryCode.DK,
      alpha3: 'DNK',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-DNK-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-DNK-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-DNK-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-DNK-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-DNK-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Djibouti',
      alpha2: CountryCode.DJ,
      alpha3: 'DJI',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-DJI-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-DJI-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-DJI-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-DJI-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-DJI-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Dominique',
      alpha2: CountryCode.DM,
      alpha3: 'DMA',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-DMA-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-DMA-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-DMA-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-DMA-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-DMA-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Égypte',
      alpha2: CountryCode.EG,
      alpha3: 'EGY',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-EGY-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-EGY-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-EGY-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-EGY-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-EGY-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'El Salvador',
      alpha2: CountryCode.SV,
      alpha3: 'SLV',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-SLV-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SLV-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SLV-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SLV-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SLV-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Émirats arabes unis',
      alpha2: CountryCode.AE,
      alpha3: 'ARE',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-ARE-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ARE-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ARE-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ARE-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ARE-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Équateur',
      alpha2: CountryCode.EC,
      alpha3: 'ECU',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-ECU-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ECU-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ECU-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ECU-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ECU-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Érythrée',
      alpha2: CountryCode.ER,
      alpha3: 'ERI',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-ERI-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ERI-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ERI-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ERI-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ERI-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Espagne',
      alpha2: CountryCode.ES,
      alpha3: 'ESP',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-ESP-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-ESP-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-ESP-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ESP-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ESP-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ESP-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ESP-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Estonie',
      alpha2: CountryCode.EE,
      alpha3: 'EST',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-EST-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-EST-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-EST-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-EST-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-EST-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-EST-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-EST-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Éthiopie',
      alpha2: CountryCode.ET,
      alpha3: 'ETH',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-ETH-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ETH-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ETH-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ETH-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ETH-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'ex-République yougoslave de Macédoine',
      alpha2: CountryCode.MK,
      alpha3: 'MKD',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-MKD-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MKD-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MKD-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MKD-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MKD-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Fédération de Russie',
      alpha2: CountryCode.RU,
      alpha3: 'RUS',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-RUS-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-RUS-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-RUS-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-RUS-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-RUS-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-RUS-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-RUS-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Fidji',
      alpha2: CountryCode.FJ,
      alpha3: 'FJI',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-FJI-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-FJI-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-FJI-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-FJI-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-FJI-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Finlande',
      alpha2: CountryCode.FI,
      alpha3: 'FIN',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-FIN-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-FIN-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-FIN-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-FIN-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-FIN-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-FIN-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-FIN-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'France',
      alpha2: CountryCode.FR,
      alpha3: 'FRA',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-FRA-F',
          elementType: 1,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-FRA-B',
          elementType: 2,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-FRA-F',
          elementType: 3,
        },
      ],
      residence_permit_before_2011: [],
      residence_permit_after_2011: [],
    },
  },
  {
    aliases: {
      fullname: 'Gabon',
      alpha2: CountryCode.GA,
      alpha3: 'GAB',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-GAB-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GAB-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GAB-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GAB-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GAB-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Gambie',
      alpha2: CountryCode.GM,
      alpha3: 'GMB',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-GMB-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GMB-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GMB-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GMB-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GMB-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Géorgie',
      alpha2: CountryCode.GE,
      alpha3: 'GEO',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-GEO-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GEO-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GEO-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GEO-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GEO-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Ghana',
      alpha2: CountryCode.GH,
      alpha3: 'GHA',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-GHA-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GHA-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GHA-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GHA-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GHA-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Grèce',
      alpha2: CountryCode.GR,
      alpha3: 'GRC',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-GRC-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-GRC-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-GRC-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GRC-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GRC-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GRC-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GRC-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Grenade',
      alpha2: CountryCode.GD,
      alpha3: 'GRD',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-GRD-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GRD-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GRD-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GRD-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GRD-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Guatemala',
      alpha2: CountryCode.GT,
      alpha3: 'GTM',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-GTM-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GTM-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GTM-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GTM-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GTM-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Guinée',
      alpha2: CountryCode.GN,
      alpha3: 'GIN',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-GIN-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GIN-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GIN-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GIN-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GIN-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Guinée équatoriale',
      alpha2: CountryCode.GQ,
      alpha3: 'GNQ',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-GNQ-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GNQ-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GNQ-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GNQ-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GNQ-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Guinée-Bissau',
      alpha2: CountryCode.GW,
      alpha3: 'GNB',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-GNB-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GNB-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GNB-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GNB-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GNB-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Guyana',
      alpha2: CountryCode.GY,
      alpha3: 'GUY',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-GUY-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GUY-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GUY-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GUY-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GUY-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Haïti',
      alpha2: CountryCode.HT,
      alpha3: 'HTI',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-HTI-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-HTI-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-HTI-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-HTI-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-HTI-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Honduras',
      alpha2: CountryCode.HN,
      alpha3: 'HND',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-HND-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-HND-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-HND-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-HND-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-HND-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Hongrie',
      alpha2: CountryCode.HU,
      alpha3: 'HUN',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-HUN-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-HUN-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-HUN-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-HUN-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-HUN-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-HUN-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-HUN-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Îles Caïmans',
      alpha2: CountryCode.KY,
      alpha3: 'CYM',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-CYM-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CYM-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CYM-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CYM-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CYM-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Îles Cook',
      alpha2: CountryCode.CK,
      alpha3: 'COK',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-COK-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-COK-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-COK-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-COK-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-COK-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Îles Marshall',
      alpha2: CountryCode.MH,
      alpha3: 'MHL',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-MHL-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MHL-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MHL-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MHL-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MHL-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Îles Salomon',
      alpha2: CountryCode.SB,
      alpha3: 'SLB',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-SLB-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SLB-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SLB-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SLB-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SLB-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Îles Vierges britanniques',
      alpha2: CountryCode.VG,
      alpha3: 'VGB',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-VGB-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-VGB-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-VGB-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-VGB-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-VGB-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Inde',
      alpha2: CountryCode.IN,
      alpha3: 'IND',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-IND-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-IND-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-IND-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-IND-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-IND-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Indonésie',
      alpha2: CountryCode.ID,
      alpha3: 'IDN',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-IDN-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-IDN-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-IDN-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-IDN-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-IDN-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: "Iran (République islamique d')",
      alpha2: CountryCode.IR,
      alpha3: 'IRN',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-IRN-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-IRN-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-IRN-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-IRN-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-IRN-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Iraq',
      alpha2: CountryCode.IQ,
      alpha3: 'IRQ',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-IRQ-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-IRQ-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-IRQ-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-IRQ-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-IRQ-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Irlande',
      alpha2: CountryCode.IE,
      alpha3: 'IRL',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-IRL-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-IRL-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-IRL-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-IRL-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-IRL-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-IRL-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-IRL-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Islande',
      alpha2: CountryCode.IS,
      alpha3: 'ISL',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-ISL-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ISL-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ISL-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ISL-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ISL-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Israël',
      alpha2: CountryCode.IL,
      alpha3: 'ISR',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-ISR-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ISR-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ISR-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ISR-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ISR-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Italie',
      alpha2: CountryCode.IT,
      alpha3: 'ITA',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-ITA-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-ITA-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-ITA-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ITA-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ITA-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ITA-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ITA-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Jamaïque',
      alpha2: CountryCode.JM,
      alpha3: 'JAM',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-JAM-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-JAM-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-JAM-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-JAM-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-JAM-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Japon',
      alpha2: CountryCode.JP,
      alpha3: 'JPN',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-JPN-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-JPN-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-JPN-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-JPN-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-JPN-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Jordanie',
      alpha2: CountryCode.JO,
      alpha3: 'JOR',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-JOR-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-JOR-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-JOR-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-JOR-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-JOR-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Kazakhstan',
      alpha2: CountryCode.KZ,
      alpha3: 'KAZ',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-KAZ-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-KAZ-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-KAZ-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-KAZ-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-KAZ-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Kenya',
      alpha2: CountryCode.KE,
      alpha3: 'KEN',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-KEN-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-KEN-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-KEN-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-KEN-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-KEN-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Kirghizistan',
      alpha2: CountryCode.KG,
      alpha3: 'KGZ',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-KGZ-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-KGZ-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-KGZ-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-KGZ-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-KGZ-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Kiribati',
      alpha2: CountryCode.KI,
      alpha3: 'KIR',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-KIR-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-KIR-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-KIR-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-KIR-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-KIR-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Kosovo',
      alpha2: CountryCode.XK,
      alpha3: 'XKX',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-XKX-F',
          elementType: 16,
        },
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-RKS-F',
          elementType: 16,
        },
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-KSV-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-XKX-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-XKX-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-XKX-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-XKX-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Koweït',
      alpha2: CountryCode.KW,
      alpha3: 'KWT',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-KWT-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-KWT-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-KWT-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-KWT-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-KWT-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Laos',
      alpha2: CountryCode.LA,
      alpha3: 'LAO',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-LAO-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LAO-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LAO-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LAO-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LAO-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Lesotho',
      alpha2: CountryCode.LS,
      alpha3: 'LSO',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-LSO-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LSO-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LSO-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LSO-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LSO-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Lettonie',
      alpha2: CountryCode.LV,
      alpha3: 'LVA',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-LVA-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-LVA-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-LVA-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LVA-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LVA-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LVA-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LVA-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Liban',
      alpha2: CountryCode.LB,
      alpha3: 'LBN',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-LBN-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LBN-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LBN-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LBN-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LBN-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Libéria',
      alpha2: CountryCode.LR,
      alpha3: 'LBR',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-LBR-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LBR-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LBR-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LBR-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LBR-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Libye',
      alpha2: CountryCode.LY,
      alpha3: 'LBY',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-LBY-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LBY-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LBY-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LBY-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LBY-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Lituanie',
      alpha2: CountryCode.LT,
      alpha3: 'LTU',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-LTU-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-LTU-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-LTU-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LTU-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LTU-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LTU-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LTU-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Luxembourg',
      alpha2: CountryCode.LU,
      alpha3: 'LUX',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-LUX-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-LUX-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-LUX-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LUX-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LUX-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LUX-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LUX-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Macao, Chine',
      alpha2: CountryCode.MO,
      alpha3: 'MAC',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-MAC-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MAC-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MAC-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MAC-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MAC-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Madagascar',
      alpha2: CountryCode.MG,
      alpha3: 'MDG',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-MDG-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MDG-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MDG-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MDG-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MDG-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Malaisie',
      alpha2: CountryCode.MY,
      alpha3: 'MYS',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-MYS-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MYS-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MYS-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MYS-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MYS-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Malawi',
      alpha2: CountryCode.MW,
      alpha3: 'MWI',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-MWI-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MWI-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MWI-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MWI-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MWI-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Maldives',
      alpha2: CountryCode.MV,
      alpha3: 'MDV',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-MDV-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MDV-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MDV-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MDV-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MDV-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Mali',
      alpha2: CountryCode.ML,
      alpha3: 'MLI',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-MLI-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MLI-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MLI-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MLI-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MLI-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Malte',
      alpha2: CountryCode.MT,
      alpha3: 'MLT',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-MLT-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-MLT-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-MLT-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MLT-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MLT-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MLT-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MLT-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Maroc',
      alpha2: CountryCode.MA,
      alpha3: 'MAR',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-MAR-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MAR-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MAR-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MAR-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MAR-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Maurice',
      alpha2: CountryCode.MU,
      alpha3: 'MUS',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-MUS-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MUS-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MUS-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MUS-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MUS-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Mauritanie',
      alpha2: CountryCode.MR,
      alpha3: 'MRT',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-MRT-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MRT-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MRT-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MRT-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MRT-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Mexique',
      alpha2: CountryCode.MX,
      alpha3: 'MEX',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-MEX-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MEX-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MEX-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MEX-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MEX-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Micronésie (Etats fédérés de)',
      alpha2: CountryCode.FM,
      alpha3: 'FSM',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-FSM-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-FSM-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-FSM-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-FSM-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-FSM-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Monaco',
      alpha2: CountryCode.MC,
      alpha3: 'MCO',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-MCO-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-MCO-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-MCO-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MCO-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MCO-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MCO-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MCO-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Mongolie',
      alpha2: CountryCode.MN,
      alpha3: 'MNG',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-MNG-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MNG-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MNG-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MNG-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MNG-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Monténégro',
      alpha2: CountryCode.ME,
      alpha3: 'MNE',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-MNE-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-MNE-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-MNE-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MNE-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MNE-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MNE-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MNE-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Montserrat',
      alpha2: CountryCode.MS,
      alpha3: 'MSR',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-MSR-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MSR-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MSR-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MSR-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MSR-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Mozambique',
      alpha2: CountryCode.MZ,
      alpha3: 'MOZ',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-MOZ-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MOZ-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MOZ-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MOZ-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MOZ-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Myanmar',
      alpha2: CountryCode.MM,
      alpha3: 'MMR',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-MMR-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MMR-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MMR-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MMR-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MMR-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Namibie',
      alpha2: CountryCode.NA,
      alpha3: 'NAM',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-NAM-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NAM-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NAM-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NAM-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NAM-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Nauru',
      alpha2: CountryCode.NR,
      alpha3: 'NRU',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-NRU-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NRU-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NRU-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NRU-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NRU-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Népal',
      alpha2: CountryCode.NP,
      alpha3: 'NPL',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-NPL-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NPL-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NPL-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NPL-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NPL-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Nicaragua',
      alpha2: CountryCode.NI,
      alpha3: 'NIC',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-NIC-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NIC-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NIC-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NIC-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NIC-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Niger',
      alpha2: CountryCode.NE,
      alpha3: 'NER',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-NER-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NER-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NER-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NER-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NER-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Nigéria',
      alpha2: CountryCode.NG,
      alpha3: 'NGA',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-NGA-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NGA-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NGA-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NGA-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NGA-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Niue',
      alpha2: CountryCode.NU,
      alpha3: 'NIU',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-NIU-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NIU-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NIU-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NIU-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NIU-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Norvège',
      alpha2: CountryCode.NO,
      alpha3: 'NOR',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-NOR-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NOR-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NOR-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NOR-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NOR-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Nouvelle-Zélande',
      alpha2: CountryCode.NZ,
      alpha3: 'NZL',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-NZL-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NZL-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NZL-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NZL-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NZL-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Oman',
      alpha2: CountryCode.OM,
      alpha3: 'OMN',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-OMN-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-OMN-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-OMN-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-OMN-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-OMN-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Ouganda',
      alpha2: CountryCode.UG,
      alpha3: 'UGA',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-UGA-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-UGA-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-UGA-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-UGA-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-UGA-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Ouzbékistan',
      alpha2: CountryCode.UZ,
      alpha3: 'UZB',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-UZB-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-UZB-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-UZB-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-UZB-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-UZB-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Pakistan',
      alpha2: CountryCode.PK,
      alpha3: 'PAK',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-PAK-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PAK-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PAK-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PAK-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PAK-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Palaos',
      alpha2: CountryCode.PW,
      alpha3: 'PLW',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-PLW-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PLW-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PLW-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PLW-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PLW-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Palestine',
      alpha2: CountryCode.PS,
      alpha3: 'PSE',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-PSE-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PSE-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PSE-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PSE-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PSE-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Panama',
      alpha2: CountryCode.PA,
      alpha3: 'PAN',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-PAN-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PAN-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PAN-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PAN-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PAN-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Papouasie-Nouvelle-Guinée',
      alpha2: CountryCode.PG,
      alpha3: 'PNG',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-PNG-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PNG-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PNG-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PNG-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PNG-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Paraguay',
      alpha2: CountryCode.PY,
      alpha3: 'PRY',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-PRY-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PRY-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PRY-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PRY-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PRY-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Pays-Bas',
      alpha2: CountryCode.NL,
      alpha3: 'NLD',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-NLD-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-NLD-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-NLD-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NLD-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NLD-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NLD-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-NLD-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Pérou',
      alpha2: CountryCode.PE,
      alpha3: 'PER',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-PER-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PER-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PER-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PER-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PER-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Philippines',
      alpha2: CountryCode.PH,
      alpha3: 'PHL',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-PHL-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PHL-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PHL-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PHL-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PHL-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Pologne',
      alpha2: CountryCode.PL,
      alpha3: 'POL',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-POL-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-POL-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-POL-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-POL-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-POL-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-POL-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-POL-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Portugal',
      alpha2: CountryCode.PR,
      alpha3: 'PRT',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-PRT-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-PRT-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-PRT-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PRT-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PRT-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PRT-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PRT-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Qatar',
      alpha2: CountryCode.QA,
      alpha3: 'QAT',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-QAT-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-QAT-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-QAT-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-QAT-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-QAT-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'République arabe syrienne',
      alpha2: CountryCode.SY,
      alpha3: 'SYR',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-SYR-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SYR-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SYR-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SYR-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SYR-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'République centrafricaine',
      alpha2: CountryCode.CF,
      alpha3: 'CAF',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-CAF-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CAF-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CAF-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CAF-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CAF-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'République de Corée',
      alpha2: CountryCode.KR,
      alpha3: 'KOR',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-KOR-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-KOR-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-KOR-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-KOR-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-KOR-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'République de Moldova',
      alpha2: CountryCode.MD,
      alpha3: 'MDA',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-MDA-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-MDA-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-MDA-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MDA-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MDA-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MDA-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-MDA-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'République démocratique du Congo',
      alpha2: CountryCode.CD,
      alpha3: 'COD',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-COD-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-COD-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-COD-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-COD-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-COD-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'République dominicaine',
      alpha2: CountryCode.DO,
      alpha3: 'DOM',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-DOM-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-DOM-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-DOM-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-DOM-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-DOM-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'République populaire démocratique de Corée',
      alpha2: CountryCode.KP,
      alpha3: 'PRK',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-PRK-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PRK-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PRK-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PRK-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-PRK-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'République tchèque',
      alpha2: CountryCode.CZ,
      alpha3: 'CZE',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-CZE-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-CZE-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-CZE-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CZE-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CZE-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CZE-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CZE-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'République-Unie de Tanzanie',
      alpha2: CountryCode.TZ,
      alpha3: 'TZA',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-TZA-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TZA-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TZA-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TZA-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TZA-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Roumanie',
      alpha2: CountryCode.RO,
      alpha3: 'ROU',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-ROU-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-ROU-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-ROU-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ROU-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ROU-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ROU-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ROU-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: "Royaume-Uni de Grande-Bretagne et d'Irlande du Nord",
      alpha2: CountryCode.GB,
      alpha3: 'GBR',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-GBR-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GBR-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GBR-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GBR-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-GBR-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Rwanda',
      alpha2: CountryCode.RW,
      alpha3: 'RWA',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-RWA-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-RWA-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-RWA-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-RWA-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-RWA-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Saint-Kitts-et-Nevis',
      alpha2: CountryCode.KN,
      alpha3: 'KNA',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-KNA-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-KNA-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-KNA-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-KNA-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-KNA-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Saint-Marin (partie française)',
      alpha2: CountryCode.MF,
      alpha3: 'MAF',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-SMR-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-SMR-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-SMR-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SMR-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SMR-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SMR-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SMR-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Saint-Martin (partie néerlandaise)',
      alpha2: CountryCode.SX,
      alpha3: 'SXM',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-SXM-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SXM-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SXM-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SXM-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SXM-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Saint-Vincent-et-les Grenadines',
      alpha2: CountryCode.VC,
      alpha3: 'VCT',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-VCT-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-VCT-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-VCT-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-VCT-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-VCT-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Sainte-Lucie',
      alpha2: CountryCode.LC,
      alpha3: 'LCA',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-LCA-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LCA-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LCA-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LCA-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LCA-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Samoa',
      alpha2: CountryCode.WS,
      alpha3: 'WSM',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-WSM-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-WSM-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-WSM-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-WSM-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-WSM-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Sao Tomé-et-Principe',
      alpha2: CountryCode.ST,
      alpha3: 'STP',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-STP-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-STP-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-STP-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-STP-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-STP-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Sénégal',
      alpha2: CountryCode.SN,
      alpha3: 'SEN',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-SEN-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SEN-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SEN-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SEN-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SEN-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Serbie',
      alpha2: CountryCode.RS,
      alpha3: 'SRB',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-SRB-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-SRB-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-SRB-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SRB-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SRB-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SRB-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SRB-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Seychelles',
      alpha2: CountryCode.SC,
      alpha3: 'SYC',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-SYC-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SYC-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SYC-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SYC-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SYC-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Sierra Leone',
      alpha2: CountryCode.SL,
      alpha3: 'SLE',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-SLE-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SLE-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SLE-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SLE-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SLE-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Singapour',
      alpha2: CountryCode.SG,
      alpha3: 'SGP',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-SGP-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SGP-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SGP-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SGP-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SGP-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Slovaquie',
      alpha2: CountryCode.SK,
      alpha3: 'SVK',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-SVK-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-SVK-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-SVK-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SVK-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SVK-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SVK-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SVK-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Slovénie',
      alpha2: CountryCode.SI,
      alpha3: 'SVN',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-SVN-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-SVN-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-SVN-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SVN-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SVN-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SVN-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SVN-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Somalie',
      alpha2: CountryCode.SO,
      alpha3: 'SOM',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-SOM-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SOM-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SOM-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SOM-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SOM-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Soudan',
      alpha2: CountryCode.SD,
      alpha3: 'SDN',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-SDN-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SDN-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SDN-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SDN-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SDN-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Soudan du Sud',
      alpha2: CountryCode.SS,
      alpha3: 'SSD',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-SSD-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SSD-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SSD-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SSD-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SSD-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Sri Lanka',
      alpha2: CountryCode.LK,
      alpha3: 'LKA',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-LKA-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LKA-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LKA-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LKA-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-LKA-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Suède',
      alpha2: CountryCode.SE,
      alpha3: 'SWE',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-SWE-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-SWE-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-SWE-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SWE-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SWE-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SWE-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SWE-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Suisse',
      alpha2: CountryCode.CH,
      alpha3: 'CHE',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-CHE-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-CHE-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-CHE-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CHE-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CHE-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CHE-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-CHE-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Suriname',
      alpha2: CountryCode.SR,
      alpha3: 'SUR',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-SUR-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SUR-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SUR-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SUR-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SUR-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Swaziland',
      alpha2: CountryCode.SZ,
      alpha3: 'SWZ',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-SWZ-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SWZ-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SWZ-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SWZ-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-SWZ-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Tadjikistan',
      alpha2: CountryCode.TJ,
      alpha3: 'TJK',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-TJK-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TJK-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TJK-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TJK-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TJK-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Taiwan',
      alpha2: CountryCode.TW,
      alpha3: 'TWN',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-TWN-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TWN-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TWN-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TWN-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TWN-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Tchad',
      alpha2: CountryCode.TD,
      alpha3: 'TCD',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-TCD-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TCD-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TCD-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TCD-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TCD-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Thaïlande',
      alpha2: CountryCode.TH,
      alpha3: 'THA',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-THA-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-THA-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-THA-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-THA-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-THA-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Timor-Leste',
      alpha2: CountryCode.TL,
      alpha3: 'TLS',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-TLS-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TLS-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TLS-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TLS-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TLS-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Togo',
      alpha2: CountryCode.TG,
      alpha3: 'TGO',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-TGO-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TGO-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TGO-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TGO-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TGO-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Tokelau',
      alpha2: CountryCode.TK,
      alpha3: 'TKL',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-TKL-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TKL-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TKL-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TKL-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TKL-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Tonga',
      alpha2: CountryCode.TO,
      alpha3: 'TON',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-TON-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TON-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TON-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TON-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TON-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Trinité-et-Tobago',
      alpha2: CountryCode.TT,
      alpha3: 'TTO',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-TTO-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TTO-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TTO-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TTO-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TTO-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Tunisie',
      alpha2: CountryCode.TN,
      alpha3: 'TUN',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-TUN-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TUN-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TUN-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TUN-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TUN-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Turkménistan',
      alpha2: CountryCode.TM,
      alpha3: 'TKM',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-TKM-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TKM-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TKM-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TKM-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TKM-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Turquie',
      alpha2: CountryCode.TR,
      alpha3: 'TUR',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-TUR-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TUR-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TUR-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TUR-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TUR-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Tuvalu',
      alpha2: CountryCode.TV,
      alpha3: 'TUV',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-TUV-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TUV-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TUV-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TUV-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-TUV-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Ukraine',
      alpha2: CountryCode.UA,
      alpha3: 'UKR',
    },
    documents: {
      id: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-UKR-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'I-UKR-B',
          elementType: 17,
        },
      ],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-UKR-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-UKR-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-UKR-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-UKR-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-UKR-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Uruguay',
      alpha2: CountryCode.UY,
      alpha3: 'URY',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-URY-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-URY-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-URY-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-URY-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-URY-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: "États-Unis d'Amérique",
      alpha2: CountryCode.US,
      alpha3: 'USA',
    },
    documents: {
      id: [],
      passport: [],
      residence_permit_before_2011: [],
      residence_permit_after_2011: [],
    },
  },
  {
    aliases: {
      fullname: 'Vanuatu',
      alpha2: CountryCode.VU,
      alpha3: 'VUT',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-VUT-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-VUT-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-VUT-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-VUT-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-VUT-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Venezuela (République bolivarienne du)',
      alpha2: CountryCode.VE,
      alpha3: 'VEN',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-VEN-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-VEN-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-VEN-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-VEN-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-VEN-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Viet Nam',
      alpha2: CountryCode.VN,
      alpha3: 'VNM',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-VNM-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-VNM-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-VNM-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-VNM-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-VNM-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Yémen',
      alpha2: CountryCode.YE,
      alpha3: 'YEM',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-YEM-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-YEM-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-YEM-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-YEM-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-YEM-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Zambie',
      alpha2: CountryCode.ZM,
      alpha3: 'ZMB',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-ZMB-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ZMB-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ZMB-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ZMB-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ZMB-B',
          elementType: 12,
        },
      ],
    },
  },
  {
    aliases: {
      fullname: 'Zimbabwe',
      alpha2: CountryCode.ZW,
      alpha3: 'ZWE',
    },
    documents: {
      id: [],
      passport: [
        {
          elementCategory: 'IDENTITY',
          elementSubCategory: 'P-ZWE-F',
          elementType: 16,
        },
      ],
      residence_permit_before_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ZWE-F',
          elementType: 16,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ZWE-B',
          elementType: 17,
        },
      ],
      residence_permit_after_2011: [
        {
          documentSide: DocumentSide.FRONT,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ZWE-F',
          elementType: 11,
        },
        {
          documentSide: DocumentSide.BACK,
          elementCategory: 'IDENTITY',
          elementSubCategory: 'R-ZWE-B',
          elementType: 12,
        },
      ],
    },
  },
];
