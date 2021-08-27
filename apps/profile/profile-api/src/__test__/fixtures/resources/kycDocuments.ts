export const kycDocuments = {
  aliases: {
    alpha2: 'AF',
    alpha3: 'AFG',
    fullname: 'Afghanistan',
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
    residence_permit_after_2011: [
      {
        documentSide: 'front',
        elementCategory: 'IDENTITY',
        elementSubCategory: 'R-AFG-F',
        elementType: 11,
      },
      {
        documentSide: 'back',
        elementCategory: 'IDENTITY',
        elementSubCategory: 'R-AFG-B',
        elementType: 12,
      },
    ],
    residence_permit_before_2011: [
      {
        documentSide: 'front',
        elementCategory: 'IDENTITY',
        elementSubCategory: 'R-AFG-F',
        elementType: 16,
      },
      {
        documentSide: 'back',
        elementCategory: 'IDENTITY',
        elementSubCategory: 'R-AFG-B',
        elementType: 17,
      },
    ],
  },
};
