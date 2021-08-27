import { ApiProvider } from '@oney/common-core';
import { Consents, CustomerGateway, Profile, Situation, Steps } from '@oney/profile-core';
import { injectable } from 'inversify';
import { OneyB2CCustomerMapper } from '../mappers/OneyB2CCustomerMapper';
import { OneyCrmApi } from '../providers/oneyB2C/OneyB2CApiProvider';

@injectable()
export class OneyB2CCustomerGateway implements CustomerGateway {
  constructor(
    private readonly _apiProvider: ApiProvider<OneyCrmApi>,
    private readonly _oneyB2CCustomerMapper: OneyB2CCustomerMapper,
  ) {}

  async create(profile: Profile): Promise<Profile> {
    await this._apiProvider.api().OneyB2CCustomerApi.create(this._oneyB2CCustomerMapper.fromDomain(profile));
    return profile;
  }

  async update(profile: Profile, isSendSid?: boolean): Promise<Profile> {
    const createCustomerRequest = this._oneyB2CCustomerMapper.fromDomain(profile);
    if (!profile.hasOnboardingStep(Steps.ADDRESS_STEP)) {
      delete createCustomerRequest.person_ids;
    } else if (profile.hasOnboardingStep(Steps.ADDRESS_STEP) && isSendSid) {
      delete createCustomerRequest.person_ids;
    }
    await this._apiProvider.api().OneyB2CCustomerApi.update(createCustomerRequest);
    return profile;
  }

  async upsert(profile: Profile): Promise<[Situation, Consents]> {
    const customerResult = await this._apiProvider
      .api()
      .OneyB2CCustomerApi.get({ emailAddress: profile.props.email });

    if (customerResult) {
      const customer = customerResult.customer[0];
      const consents = {
        oney: {
          cnil: customer.cnil_oney_flag === '0',
          len: customer.len_oney_flag === '0' ? true : customer.len_oney_flag === '1' ? false : null,
        },
        partners: {
          cnil: customer.cnil_partner_flag === '0',
          len: customer.len_oney_flag === '0' ? true : customer.len_oney_flag === '1' ? false : null,
        },
      };
      const situation = {
        lead: false,
        staff: Boolean(parseInt(customer.staff_member_flag)),
        vip: Boolean(parseInt(customer.vip_flag)),
      };

      profile.props.consents = consents;
      const isSendSid =
        customer.person_ids.filter(person_id => person_id.application_person_id_field === 'SID').length !== 0;
      await this.update(profile, isSendSid);
      return [situation, consents];
    } else {
      const situation = {
        lead: true,
        staff: false,
        vip: false,
      };

      await this.create(profile);
      return [situation, profile.props.consents];
    }
  }
}
