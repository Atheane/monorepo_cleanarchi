/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { describe } from '@jest/globals';
import { OfferType } from '@oney/subscription-messages';
import { CreateInsuranceMembershipRequest, InsuranceErrors } from '@oney/subscription-core';
import { HonorificCode } from '@oney/profile-messages';
import { SPBCreateMembershipMapper } from '../../../adapters/mappers/SPBCreateMembershipMapper';
import {
  createMembershipRequest,
  spbCreateMembershipRequest,
} from '../fixtures/insurance/createMembershipInsurance';
import { SpbOfferTypes } from '../../../adapters/partners/spb/models/types/SpbOfferTypes';
import { CustomerTitle } from '../../../adapters/partners/spb/models/types/CustomerTitle';
import { SPBCreateMembershipRequest } from '../../../adapters/partners/spb/models/membership/SPBCreateMembershipRequest';

describe('UNIT - CreateMembershipSPBRequest', () => {
  const spbCreateMembershipMapper = new SPBCreateMembershipMapper('1100');
  const unHandledOffer = [OfferType.ACCOUNT_FEE, OfferType.VISA_CLASSIC, OfferType.VISA_PREMIER];

  it('Should return request with customerTitle = MR and offer = 429_ONEYBDPREMIER_001', async () => {
    const spbRequest = spbCreateMembershipMapper.fromDomain(createMembershipRequest);
    expect(spbRequest).toEqual(spbCreateMembershipRequest);
  });

  it('Should return request with customerTitle = MRS and offer = 429_ONEYBDCLASSIC_001', async () => {
    const domainRequest: CreateInsuranceMembershipRequest = {
      ...createMembershipRequest,
      offerType: OfferType.ONEY_ORIGINAL,
      profileInfo: {
        ...createMembershipRequest.profileInfo,
        honorificCode: HonorificCode.FEMALE,
      },
    };
    const expectedSPBRequest: SPBCreateMembershipRequest = {
      offerUIDs: [SpbOfferTypes.ONEYBDCLASSIC_001],
      customer: {
        ...spbCreateMembershipRequest.customer,
        title: CustomerTitle.MRS,
        bankingInfo: {
          ...spbCreateMembershipRequest.customer.bankingInfo,
          bankAccountHolder: `MRS ${createMembershipRequest.profileInfo.legalName} ${createMembershipRequest.profileInfo.firstName}`,
        },
      },
    };
    const spbRequest = spbCreateMembershipMapper.fromDomain(domainRequest);
    expect(spbRequest).toEqual(expectedSPBRequest);
  });

  it('Should throw because honorificCode is not managed', async () => {
    const domainRequest: CreateInsuranceMembershipRequest = {
      ...createMembershipRequest,
      profileInfo: {
        ...createMembershipRequest.profileInfo,
        honorificCode: '' as HonorificCode,
      },
    };
    expect(() => {
      spbCreateMembershipMapper.fromDomain(domainRequest);
    }).toThrowError(new InsuranceErrors.HonorificCodeNotHandle('Honorific code is not managed'));
  });

  unHandledOffer.map(value => {
    it('Should throw because offer type is not managed', async () => {
      const domainRequest: CreateInsuranceMembershipRequest = {
        ...createMembershipRequest,
        offerType: value,
      };
      expect(() => {
        spbCreateMembershipMapper.fromDomain(domainRequest);
      }).toThrowError(new InsuranceErrors.OfferNotAvailable('Offer is not available'));
    });
  });
});
