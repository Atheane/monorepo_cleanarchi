import 'reflect-metadata';
import {
  DocumentType,
  Profile,
  ProfileDocument,
  ProfileDocumentPartner,
  ProfileDocumentProps,
  ProfileInformations,
  ProfileProperties,
  Steps,
} from '@oney/profile-core';
import {
  ContractSigned,
  CountryCode,
  DocumentAdded,
  DocumentDeleted,
  IdentityDocumentInvalidated,
  IdentityDocumentValidated,
  ProfileStatus,
  ProfileStatusChanged,
  TaxNoticeUploaded,
} from '@oney/profile-messages';

describe('Profile aggregate test', () => {
  it('should remove CONTRACT_STEP from kyc status when signing contract', () => {
    const profile = new Profile(getProfileProperties());

    profile.signContract(new Date());

    expect(profile.props.kyc.steps.includes(Steps.CONTRACT_STEP)).toBeFalsy();
  });

  it('should not update profile information status to ON_HOLD when signing contract after verification required', () => {
    const profile = new Profile(getProfileProperties(ProfileStatus.ACTION_REQUIRED));

    profile.signContract(new Date());

    expect(profile.props.informations.status).toEqual(ProfileStatus.ACTION_REQUIRED);
  });

  it('should update contractSignedAt when signing contract', () => {
    const profile = new Profile(getProfileProperties());
    const signingDate = new Date('2021-02-10T19:29:06.341Z');

    profile.signContract(signingDate);

    expect(profile.props.kyc.contractSignedAt).toEqual(signingDate);
  });

  it('should add ContractSigned domain event', () => {
    const profile = new Profile(getProfileProperties(ProfileStatus.ACTIVE));

    profile.signContract(new Date());

    expect(profile.getEvents().length).toEqual(1);
    expect(profile.getEvents()[0]).toBeInstanceOf(ContractSigned);
  });

  it('should remove document from profile', () => {
    const profile = new Profile(getProfileProperties());

    profile.deleteDocument(getProfileDocument('1111'));

    expect(profile.props.documents.length).toEqual(0);
  });

  it('should add document deleted event when document is deleted from profile', () => {
    const profile = new Profile(getProfileProperties());

    profile.deleteDocument(getProfileDocument('1111'));

    expect(profile.events.length).toEqual(1);
    expect(profile.events[0]).toBeInstanceOf(DocumentDeleted);
  });

  it('should add document to profile', () => {
    const profile = new Profile(getProfileProperties());

    profile.addDocument(getProfileDocument('2222'));

    expect(profile.props.documents.length).toEqual(2);
    expect(profile.props.documents).toEqual([getProfileDocument('1111'), getProfileDocument('2222')]);
  });

  it('should add document added event when document is added to profile', () => {
    const profile = new Profile(getProfileProperties());

    profile.addDocument(getProfileDocument('2222'));

    expect(profile.events.length).toEqual(1);
    expect(profile.events[0]).toBeInstanceOf(DocumentAdded);
  });

  it('should add tax notice to profile', () => {
    const profile = new Profile(getProfileProperties());

    profile.addDocument(getProfileDocument('2222', DocumentType.TAX_NOTICE, ProfileDocumentPartner.KYC));

    expect(profile.props.documents.length).toEqual(2);
    expect(profile.props.documents).toEqual([
      getProfileDocument('1111'),
      getProfileDocument('2222', DocumentType.TAX_NOTICE, ProfileDocumentPartner.KYC),
    ]);
  });

  it('should validate identity document step', () => {
    const profile = new Profile(getProfileProperties());

    profile.validateIdentityDocument(CountryCode.FR);

    expect(profile.props.kyc.steps).not.toContain(Steps.IDENTITY_DOCUMENT_STEP);
    expect(profile.events.length).toEqual(1);
    expect(profile.events[0]).toBeInstanceOf(IdentityDocumentValidated);
    expect(profile.props.informations.nationalityCountryCode).toEqual(CountryCode.FR);
  });

  it('should change profile status to on hold when it is action required id', () => {
    const profile = new Profile(getProfileProperties(ProfileStatus.ACTION_REQUIRED_ID));

    profile.validateIdentityDocument(CountryCode.FR);

    expect(profile.props.informations.nationalityCountryCode).toEqual(CountryCode.FR);
  });

  it('should not change profile status when it is on boarding', () => {
    const profile = new Profile(getProfileProperties(ProfileStatus.ON_BOARDING));

    profile.validateIdentityDocument(CountryCode.FR);

    expect(profile.props.informations.status).toContain(ProfileStatus.ON_BOARDING);
    expect(profile.props.informations.nationalityCountryCode).toEqual(CountryCode.FR);
  });

  it('should invalidate identity document step', () => {
    const profile = new Profile(getProfileProperties());

    profile.invalidateIdentityDocument();

    expect(profile.props.kyc.steps).toContain(Steps.IDENTITY_DOCUMENT_STEP);
    expect(profile.events.length).toEqual(1);
    expect(profile.events[0]).toBeInstanceOf(IdentityDocumentInvalidated);
  });

  it('should set taxNoticeUploaded to true', () => {
    const profile = new Profile(getProfileProperties());
    const taxNotice = getProfileDocument('111', DocumentType.TAX_NOTICE);
    profile.uploadTaxNotice(taxNotice);

    expect(profile.props.kyc.taxNoticeUploaded).toBeTruthy();
    expect(profile.events.length).toEqual(1);
    expect(profile.events[0]).toBeInstanceOf(TaxNoticeUploaded);
  });

  it('should apply new KYC to profile', () => {
    const profile = new Profile(getProfileProperties());
    const oldKyc = profile.props.kyc;

    profile.createNewKyc('new-case-reference', 12345);

    expect(profile.props.kyc).toEqual({
      caseReference: 'new-case-reference',
      caseId: 12345,
      steps: ['contract'],
      contractSignedAt: undefined,
      creationDate: profile.props.kyc.creationDate,
      versions: [{ ...oldKyc }],
      taxNoticeUploaded: true,
    });
    expect(profile.events.length).toEqual(1);
  });

  it('should update account eligibility', () => {
    const profile = new Profile(getProfileProperties());

    profile.updateEligibility(true);

    expect(profile.props.kyc.eligibility).toEqual({ accountEligibility: true });
  });

  it('should set eligibilityReceived to true', () => {
    const profile = new Profile(getProfileProperties());

    profile.updateEligibility(true);

    expect(profile.props.kyc.eligibilityReceived).toBeTruthy();
  });

  it('should push current version to KYC', () => {
    const profile = new Profile(getProfileProperties());
    profile.props.kyc.versions = [];
    profile.props.kyc.versions.push(
      {
        caseReference: 'old1-case-reference',
        steps: [Steps.CONTRACT_STEP],
        contractSignedAt: undefined,
        amlReceived: false,
        eligibilityReceived: false,
      },
      {
        caseReference: 'old2-case-reference',
        steps: [Steps.CIVIL_STATUS_STEP, Steps.CONTRACT_STEP],
        contractSignedAt: undefined,
        creationDate: new Date('2020-01-01'),
        amlReceived: false,
        eligibilityReceived: false,
      },
    );
    const { versions, ...oldKyc } = profile.props.kyc;

    profile.createNewKyc('new-case-reference', 12345);

    expect(profile.props.kyc).toEqual({
      caseReference: 'new-case-reference',
      caseId: 12345,
      steps: ['contract'],
      contractSignedAt: undefined,
      creationDate: profile.props.kyc.creationDate,
      versions: [versions[0], versions[1], oldKyc],
      taxNoticeUploaded: true,
    });
    expect(profile.events.length).toEqual(1);
  });

  describe('update profile status', () => {
    it('should not update when it is the same status', () => {
      const profile = new Profile(getProfileProperties(ProfileStatus.ACTIVE));

      profile.updateStatus();

      expect(profile.props.informations.status).toEqual(ProfileStatus.ACTIVE);
    });

    it('should update when new status is different', () => {
      const profile = new Profile(getProfileProperties(ProfileStatus.ACTION_REQUIRED_TAX_NOTICE));

      profile.updateStatus();

      expect(profile.props.informations.status).toEqual(ProfileStatus.ON_HOLD);
    });

    it('should not send event when it is the same status', () => {
      const profile = new Profile(getProfileProperties(ProfileStatus.ACTIVE));

      profile.updateStatus();

      expect(profile.events.length).toEqual(0);
    });

    it('should send event when new status is different', () => {
      const profile = new Profile(getProfileProperties(ProfileStatus.ACTION_REQUIRED_TAX_NOTICE));

      profile.updateStatus();

      expect(profile.events.length).toEqual(1);
      expect(profile.events[0]).toBeInstanceOf(ProfileStatusChanged);
    });

    it('should update status when a different status is given', () => {
      const profile = new Profile(getProfileProperties(ProfileStatus.ON_BOARDING));

      profile.updateStatus(ProfileStatus.ACTIVE);

      expect(profile.props.informations.status).toEqual(ProfileStatus.ACTIVE);
    });

    it('should send event when a different status is given', () => {
      const profile = new Profile(getProfileProperties(ProfileStatus.ON_BOARDING));

      profile.updateStatus(ProfileStatus.ACTIVE);

      expect(profile.events.length).toEqual(1);
      expect(profile.events[0]).toBeInstanceOf(ProfileStatusChanged);
    });
  });

  const getProfileProperties = (status: ProfileStatus = ProfileStatus.ON_BOARDING) => {
    return {
      informations: { status: status } as ProfileInformations,
      kyc: {
        caseReference: 'the-case-ref',
        steps: [Steps.CONTRACT_STEP],
        contractSignedAt: undefined,
        taxNoticeUploaded: true,
      },
      documents: [getProfileDocument()],
    } as ProfileProperties;
  };

  const getProfileDocument = (
    uid = '1111',
    type = DocumentType.ID_DOCUMENT,
    partner = ProfileDocumentPartner.ODB,
  ) => {
    return new ProfileDocument({
      uid: uid,
      type,
      location: 'http-to-azure-store',
      partner,
    } as ProfileDocumentProps);
  };
});
