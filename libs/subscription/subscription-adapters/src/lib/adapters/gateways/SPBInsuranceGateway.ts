import {
  InsuranceGateway,
  CreatedMembership,
  CreateInsuranceMembershipRequest,
} from '@oney/subscription-core';
import { inject, injectable } from 'inversify';
import { NetworkProvider, PaymentIdentifier } from '@oney/payment-core';
import { SPBApis } from '../partners/spb/SPBNetworkProvider';
import { SPBCreateMembershipMapper } from '../mappers/SPBCreateMembershipMapper';

@injectable()
export class SPBInsuranceGateway implements InsuranceGateway {
  constructor(
    @inject(PaymentIdentifier.networkProvider) private readonly _networkProvider: NetworkProvider<SPBApis>,
    private readonly _bin8MissingChar: string,
  ) {}

  async createMembership(request: CreateInsuranceMembershipRequest): Promise<CreatedMembership> {
    const { number } = await this._networkProvider
      .api()
      .membershipApi.create(new SPBCreateMembershipMapper(this._bin8MissingChar).fromDomain(request));
    return { insuranceMembershipId: number };
  }

  async activateMembership(request: CreatedMembership): Promise<void> {
    await this._networkProvider.api().membershipApi.activate(request.insuranceMembershipId);
  }
}
