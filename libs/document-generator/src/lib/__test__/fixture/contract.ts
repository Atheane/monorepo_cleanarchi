import { Body } from '../../type/Body';
import { Footer } from '../../type/Footer';

export const PROFILE = {
  uid: 'azerty',
  honorificCode: '1',
  birthName: 'birthNameValue',
  legalName: 'legalNameValue',
  firstName: 'firstNameValue',
  birthDate: new Date(),
  birthCountry: 'birthCountryValue',
  birthCity: 'birthCityValue',
  nationalityCountryCode: 'nationalityCountryCodeValue',
  street: 'streetValue',
  zipCode: 'zipCodeValue',
  city: 'cityValue',
  country: 'countryValue',
  phone: 'phoneValue',
  email: 'emailValue',
  economicActivity: 0,
  earningsAmount: 0,
  fiscalCountry: 'fiscalCountryValue',
  signatureDate: new Date(),
  nif: 'azertyuiop',
};

export const SETTINGS_BODY = {
  body: Body.CONTRAT,
};

export const SETTINGS_BODY_FOOTER = {
  body: Body.CONTRAT,
  footer: Footer.CONTRAT,
};

export const SETTINGS_BODY_FOOTER_OPTION = {
  body: Body.CONTRAT,
  footer: Footer.CONTRAT,
  option: {
    marginBottom: '2cm',
    enableSmartShrinking: true,
    marginLeft: 20,
    marginRight: 20,
  },
};

export const PATH = `${PROFILE.uid}/contract/contract.pdf`;
export const BLOB_STORAGE_CS =
  'DefaultEndpointsProtocol=https;AccountName=odb0storage0dev;AccountKey=wiS0upEBf91Dxz2Q7D0TUMYu+3nG0EwN3UgVPXi5gC5LAahZZPKjlYqq/i0w04/L2saKNRZBr6FnrQdxaLIx8Q==;EndpointSuffix=core.windows.net';
export const BLOB_STORAGE_CONTAINER_NAME = 'documents';
