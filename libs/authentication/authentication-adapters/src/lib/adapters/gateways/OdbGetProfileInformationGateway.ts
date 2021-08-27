import { ServiceApi } from '@oney/common-adapters';
import { ApiProvider } from '@oney/common-core';
import { GetProfileInformationGateway } from '@oney/payment-core';
import { injectable } from 'inversify';
import { ProfileInfos } from '@oney/profile-messages';

@injectable()
export class OdbGetProfileInformationGateway implements GetProfileInformationGateway {
  constructor(private readonly _apiProvider: ApiProvider<ServiceApi>) {}

  async getById(uid: string): Promise<ProfileInfos> {
    const result = await this._apiProvider.api().profile.getProfileInformation(uid);
    return {
      informations: {
        phone: result.profile.phone,
        legalName: result.profile.legal_name,
        firstName: result.profile.first_name,
        honorificCode: result.profile.honorific_code,
        birthDate: result.profile.birth_date,
        birthCountry: result.profile.birth_country,
        birthCity: result.profile.birth_city,
        birthDepartmentCode: result.profile.birth_department_code,
        birthDistrictCode: result.profile.birth_district_code,
        address: null,
        nationalityCountryCode: result.profile.birth_country,
        birthName: result.profile.birth_name,
        earningsAmount: result.profile.earnings_amount,
        fiscalCountry: result.profile.fiscal_country,
        economicActivity: null,
        status: result.profile.status,
        fiscalReference: null,
      },
      ...(result.kyc && {
        kyc: {
          decision: result.kyc.decision,
          ...(result.kyc.politicallyExposed && {
            politicallyExposed: result.kyc.politicallyExposed,
          }),
          ...(result.kyc.sanctioned && {
            sanctioned: result.kyc.sanctioned,
          }),
          ...(result.documents && {
            documents: result.documents,
          }),
        },
      }),
      email: result.email,
      uid: result.uid,
      enabled: result.is_validated,
    };
  }
}
