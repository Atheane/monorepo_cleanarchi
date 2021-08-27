import {
  BankAccountInformation,
  CreditCardInformation,
  OfferType,
  ProfileInformation,
} from '@oney/subscription-messages';

export interface CreateInsuranceMembershipRequest {
  offerType: OfferType;
  profileInfo: ProfileInformation;
  bankAccountInfo: BankAccountInformation;
  creditCardInfo: CreditCardInformation;
}

export interface CreatedMembership {
  insuranceMembershipId: string;
}

export interface InsuranceGateway {
  createMembership(request: CreateInsuranceMembershipRequest): Promise<CreatedMembership>;
  activateMembership(request: CreatedMembership): Promise<void>;
}
