import { Mapper } from '@oney/common-core';
import {
  ContractDocumentRequest,
  ProfessionalCategoriesList,
  Profile,
  CountriesList,
  EarningsThresholdIntervalList,
} from '@oney/profile-core';
import { injectable } from 'inversify';

@injectable()
export class ContractDocumentRequestMapper implements Mapper<Profile, ContractDocumentRequest> {
  fromDomain(profile: Profile): ContractDocumentRequest {
    return {
      uid: profile.props.uid,
      honorificCode: profile.props.informations.honorificCode,
      birthName: profile.props.informations.birthName,
      legalName: profile.props.informations.legalName,
      firstName: profile.props.informations.firstName,
      birthDate: profile.props.informations.birthDate,
      birthCountry: CountriesList.find(
        country => country.code === profile.props.informations.birthCountry.value,
      ).name,
      birthCity: profile.props.informations.birthCity,
      nationalityCountryCode: CountriesList.find(
        country => country.code === profile.props.informations.nationalityCountryCode,
      ).name,
      street: profile.props.informations.address.street,
      zipCode: profile.props.informations.address.zipCode,
      city: profile.props.informations.address.city,
      country: CountriesList.find(country => country.code === profile.props.informations.address.country)
        .name,
      phone: profile.props.informations.phone,
      email: profile.props.email,
      economicActivity: ProfessionalCategoriesList.find(category =>
        profile.props.informations.economicActivity.toString().startsWith(category.code.toString()),
      ).values.find(sous_category => sous_category.code === profile.props.informations.economicActivity)
        .label,
      earningsAmount: EarningsThresholdIntervalList.find(
        earningsThresholdInterval =>
          earningsThresholdInterval.code === profile.props.informations.earningsAmount.toString(),
      ).name,
      fiscalCountry: CountriesList.find(
        country => country.code === profile.props.informations.fiscalReference.country,
      ).name,
      signatureDate: profile.props.kyc.contractSignedAt,
      nif: profile.props.informations.fiscalReference.fiscalNumber
        ? profile.props.informations.fiscalReference.fiscalNumber
        : 'NA',
    };
  }
}
