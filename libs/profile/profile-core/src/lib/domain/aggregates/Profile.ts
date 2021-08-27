import 'reflect-metadata';
import { AggregateRoot, Handle } from '@oney/ddd';
import { getEnumKeyByEnumValue, PartialExceptFor } from '@oney/common-core';
import {
  AddressStepValidated,
  CivilStatusValidated,
  ConsentUpdated,
  ContractSigned,
  CountryCode,
  CustomerSituationsUpdated,
  DiligenceSctInCompleted,
  DocumentAdded,
  DocumentDeleted,
  FiscalStatusValidated,
  IdentityDocumentInvalidated,
  IdentityDocumentValidated,
  MoneyLaunderingRiskUpdated,
  NewKYCCreated,
  OnboardingSteps,
  PhoneStepValidated,
  ProfileActivated,
  ProfileActivationType,
  ProfileCreated,
  ProfileScoringUpdated,
  ProfileStatus,
  ProfileStatusChanged,
  Scoring,
  SituationAttached,
  SubscriptionStepValidated,
  TaxNoticeAnalysisRejected,
  TaxNoticeAnalysisSucceeded,
  TaxNoticeUploaded,
  UserFacematchValidated,
  UserFacematchValidatedProps,
  UserKycDecisionUpdated,
} from '@oney/profile-messages';
import { LcbFtRiskLevel } from '@oney/payment-messages';
import { ProfileDocument } from './ProfileDocument';
import { ProfileInformations } from '../valuesObjects/ProfileInformations';
import { KYC } from '../valuesObjects/KYC';
import { FiscalReference } from '../valuesObjects/FiscalReference';
import { Steps } from '../types/Steps';
import { DeclarativeFiscalSituation } from '../types/DeclarativeFiscalSituation';
import { Situation } from '../types/Situation';
import { ProfileDocumentPartner } from '../types/ProfileDocumentPartner';
import { CustomerSituations } from '../valuesObjects/CustomerSituations';
import { CountriesList } from '../types/CountriesList';
import { FiscalData } from '../valuesObjects/FiscalData';
import { Consents } from '../valuesObjects/Consents';
import { StatusStrategy } from '../services/ProfileStatusStrategy/StatusStrategy';

export interface ProfileProperties {
  uid: string;
  email: string;
  enabled: boolean;
  informations: ProfileInformations;
  kyc: KYC;
  digitalIdentityId: string;
  biometricKey?: string;
  ipAddress?: string;
  documents: ProfileDocument[];
  situation?: Situation;
  consents: Consents;
}

export class Profile extends AggregateRoot<ProfileProperties> {
  props: ProfileProperties;

  constructor(props: PartialExceptFor<ProfileProperties, 'uid'>) {
    super(props.uid);
    this.props = props as ProfileProperties;
  }

  updateConsent(consents: Consents): void {
    this.applyChange(new ConsentUpdated(consents));
  }

  @Handle(ConsentUpdated)
  applyUpdateConsent(event: ConsentUpdated) {
    this.props.consents = event.props;
  }

  updateKycDecision(): Profile {
    //TODO this event handlers don't use status
    this.addDomainEvent(
      new UserKycDecisionUpdated({
        informations: {
          status: this.props.informations.status,
        },
        kyc: {
          decision: this.props.kyc.decision,
          politicallyExposed: this.props.kyc.politicallyExposed,
          sanctioned: this.props.kyc.sanctioned,
        },
        documents: this.props.documents
          .filter(document => document.props.partner === ProfileDocumentPartner.ODB)
          .map(odbDocument => ({
            type: odbDocument.props.type,
            side: odbDocument.props.side,
            location: odbDocument.props.location,
          })),
      }),
    );
    return this;
  }

  updateLcbFt(moneyLaunderingRisk: LcbFtRiskLevel): Profile {
    //TODO this event handlers don't use status
    this.props.kyc = {
      ...this.props.kyc,
      moneyLaunderingRisk,
      amlReceived: true,
    };
    this.addDomainEvent(
      new MoneyLaunderingRiskUpdated({
        moneyLaunderingRisk,
        status: ProfileStatus[getEnumKeyByEnumValue(ProfileStatus, this.props.informations.status)],
      }),
    );
    return this;
  }

  completeDiligence(status: ProfileStatus): Profile {
    this.applyChange(
      new DiligenceSctInCompleted({
        status: status,
      }),
    );
    return this;
  }

  @Handle(DiligenceSctInCompleted)
  applyCompleteDiligence(event: DiligenceSctInCompleted) {
    if (this.applyNonActiveStatus(event.props.status)) {
      this.applyChange(new ProfileStatusChanged({ status: event.props.status }));
    }
  }

  validateFacematch(facematchProps: UserFacematchValidatedProps): Profile {
    this.props.kyc.steps = this.props.kyc.steps.filter(step => step !== Steps.FACEMATCH_STEP);
    this.addDomainEvent(
      new UserFacematchValidated({
        ...facematchProps,
      }),
    );
    return this;
  }

  addDocument(document: ProfileDocument) {
    this.applyChange(new DocumentAdded(document.props));
    return this;
  }

  @Handle(DocumentAdded)
  handleAddDocument(event: DocumentAdded) {
    this.props.documents.push(new ProfileDocument(event.props));
  }

  deleteDocument(documentToRemove: ProfileDocument) {
    this.applyChange(new DocumentDeleted(documentToRemove.props));
    return this;
  }

  @Handle(DocumentDeleted)
  handleDeleteDocument(event: DocumentDeleted) {
    const documentToRemove = new ProfileDocument(event.props);
    this.props.documents = this.props.documents.filter(document => !document.equals(documentToRemove));
  }

  validateIdentityDocument(nationalityCountryCode: CountryCode): Profile {
    this.applyChange(
      new IdentityDocumentValidated({
        nationality: nationalityCountryCode,
      }),
    );
    return this;
  }

  @Handle(IdentityDocumentValidated)
  handleIdentityDocumentValidation(event: IdentityDocumentValidated) {
    this.props.informations.nationalityCountryCode = event.props.nationality;
    this.props.kyc.steps = this.props.kyc.steps.filter(step => step !== Steps.IDENTITY_DOCUMENT_STEP);
  }

  invalidateIdentityDocument(): Profile {
    this.props.kyc.steps.push(Steps.IDENTITY_DOCUMENT_STEP);
    this.addDomainEvent(new IdentityDocumentInvalidated());
    return this;
  }

  activate(activationType: ProfileActivationType): Profile {
    this.props.informations.status = ProfileStatus.ACTIVE;
    this.addDomainEvent(
      new ProfileActivated({
        profileStatus: ProfileStatus.ACTIVE,
        activationType,
      }),
    );
    return this;
  }

  updateProfile(props: PartialExceptFor<ProfileProperties, 'uid'>): Profile {
    this.props = {
      ...this.props,
      ...props,
    };
    return this;
  }

  civilStatus(profileInformation: ProfileInformations): Profile {
    this.props.informations = {
      ...this.props.informations,
      ...profileInformation,
    };
    this.props.kyc.steps = this.props.kyc.steps.filter(step => step !== Steps.CIVIL_STATUS_STEP);

    this.addDomainEvent(
      new CivilStatusValidated({
        birthCity: profileInformation.birthCity,
        birthCountry: profileInformation.birthCountry.value,
        birthDate: profileInformation.birthDate,
        birthName: profileInformation.birthName,
        firstName: profileInformation.firstName,
        honorificCode: profileInformation.honorificCode,
        legalName: profileInformation.legalName,
        nationalityCountryCode: this.props.informations.nationalityCountryCode,
      }),
    );
    return this;
  }

  attachSituation(situation: Situation, consents: Consents): Profile {
    this.applyChange(new SituationAttached({ ...situation, consents }));
    return this;
  }

  @Handle(SituationAttached)
  applyAttachSituation(event: SituationAttached) {
    this.props.situation = {
      lead: event.props.lead,
      vip: event.props.vip,
      staff: event.props.staff,
    };
    this.props.consents = event.props.consents;
  }

  addressStep(): Profile {
    this.props.kyc.steps = this.props.kyc.steps.filter(step => step !== Steps.ADDRESS_STEP);
    this.addDomainEvent(
      new AddressStepValidated({
        ...this.props.informations.address,
      }),
    );
    return this;
  }

  validatePhoneStep(phone: string, caseReference: string, url: string): Profile {
    this.props.informations.phone = phone;
    this.props.kyc.caseReference = caseReference;
    this.props.kyc.url = url;
    this.props.kyc.steps = this.props.kyc.steps.filter(step => step !== Steps.PHONE_STEP);
    this.addDomainEvent(
      new PhoneStepValidated({
        phone,
      }),
    );
    return this;
  }

  updateFiscalStatus(
    fiscalReference: FiscalReference,
    declarativeFiscalSituation: DeclarativeFiscalSituation,
  ) {
    this.props.informations.earningsAmount = parseInt(declarativeFiscalSituation.income, 10);
    this.props.informations.economicActivity = parseInt(declarativeFiscalSituation.economicActivity, 10);
    this.props.informations.fiscalReference = fiscalReference;
    this.props.kyc.steps = this.props.kyc.steps.filter(step => step !== Steps.FISCAL_STATUS_STEP);
    this.addDomainEvent(
      new FiscalStatusValidated({
        fiscalDeclaration: {
          economicActivity: this.props.informations.economicActivity.toString(),
          income: this.props.informations.earningsAmount.toString(),
        },
        fiscalReference: this.props.informations.fiscalReference,
      }),
    );
    return this;
  }

  signContract(date: Date) {
    this.props.kyc.contractSignedAt = date;
    this.props.kyc.steps = this.props.kyc.steps.filter(step => step !== Steps.CONTRACT_STEP);
    this.addDomainEvent(new ContractSigned({ date }));
  }

  static createProfile(props: {
    email: string;
    uid: string;
    digitalIdentityId: string;
    phone?: string;
  }): Profile {
    const profile = new Profile({
      email: null,
      uid: props.uid,
      informations: { phone: null, status: ProfileStatus.ON_BOARDING },
      kyc: { steps: null },
    } as ProfileProperties);
    profile.applyChange(
      new ProfileCreated({
        email: props.email,
        uid: props.uid,
        digitalIdentityId: props.digitalIdentityId,
        ...(props.phone && {
          phone: props.phone,
        }),
        steps: [
          OnboardingSteps.PHONE_STEP,
          OnboardingSteps.SELECT_OFFER_STEP,
          OnboardingSteps.IDENTITY_DOCUMENT_STEP,
          OnboardingSteps.CIVIL_STATUS_STEP,
          OnboardingSteps.FACEMATCH_STEP,
          OnboardingSteps.ADDRESS_STEP,
          OnboardingSteps.FISCAL_STATUS_STEP,
          OnboardingSteps.CONTRACT_STEP,
        ],
        status: ProfileStatus.ON_BOARDING,
      }),
    );
    return profile;
  }

  @Handle(ProfileCreated)
  applyCreateProfile(event: ProfileCreated) {
    this.props.email = event.props.email;
    this.props.enabled = true;
    this.props.digitalIdentityId = event.props.digitalIdentityId;
    if (event.props.phone) {
      this.props.informations.phone = event.props.phone;
    }
    this.props.kyc.steps = [
      Steps.PHONE_STEP,
      Steps.SELECT_OFFER_STEP,
      Steps.IDENTITY_DOCUMENT_STEP,
      Steps.CIVIL_STATUS_STEP,
      Steps.FACEMATCH_STEP,
      Steps.ADDRESS_STEP,
      Steps.FISCAL_STATUS_STEP,
      Steps.CONTRACT_STEP,
    ];
  }

  @Handle(CustomerSituationsUpdated)
  applyUpdateCustomerSituations(event: CustomerSituationsUpdated) {
    this.props.situation.lead = event.props.lead;
  }

  updateCustomerSituations(customerSituations: CustomerSituations) {
    this.applyChange(
      new CustomerSituationsUpdated({
        uuid: this.props.uid,
        timestamp: new Date(),
        lead: customerSituations.lead,
        internalIncidents: customerSituations.internalIncidents,
        creditAccountsSituation: customerSituations.creditAccountsSituation,
      }),
    );
  }

  hasOnboardingStep(step: Steps): boolean {
    return this.props.kyc.steps.includes(step);
  }

  updateEligibility(accountEligibility: boolean) {
    this.props.kyc.eligibilityReceived = true;
    this.props.kyc.eligibility = { accountEligibility };
  }

  private applyNonActiveStatus(status: ProfileStatus): boolean {
    return (
      status !== this.props.informations.status && this.props.informations.status !== ProfileStatus.ACTIVE
    );
  }

  @Handle(NewKYCCreated)
  applyNewKyc(event: NewKYCCreated) {
    const { versions, ...oldKYC } = this.props.kyc;
    if (versions)
      versions.push({
        ...oldKYC,
      });
    this.props.kyc = {
      ...oldKYC,
      caseReference: event.props.caseReference,
      caseId: event.props.caseId,
      creationDate: new Date(),
      versions: versions ? versions : [oldKYC],
    };
  }

  createNewKyc(caseReference: string, caseId: number) {
    this.applyChange(
      new NewKYCCreated({
        caseReference,
        caseId,
      }),
    );
  }

  validateSubscriptionStep(): this {
    this.applyChange(new SubscriptionStepValidated());
    return this;
  }

  @Handle(SubscriptionStepValidated)
  private applySubscriptionValidated() {
    this.props.kyc.steps = this.props.kyc.steps.filter(step => step !== Steps.SELECT_OFFER_STEP);
  }

  getBirthCountry(): string {
    if (this.props.informations.birthCountry) {
      const birthCountry = CountriesList.find(
        country => country.code === this.props.informations.birthCountry.value,
      );
      if (birthCountry) {
        return birthCountry.name;
      }
    }
    return null;
  }

  updateScoring(scoring: Scoring) {
    this.applyChange(new ProfileScoringUpdated({ scoring }));
  }

  @Handle(ProfileScoringUpdated)
  applyProfileScoringUpdated(event: ProfileScoringUpdated): void {
    this.props.kyc = { ...this.props.kyc, ...event.props.scoring };
  }

  rejectTaxNotice() {
    this.applyChange(new TaxNoticeAnalysisRejected({}));
  }

  // There is nothing to change but event lib requires Handle method
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  @Handle(TaxNoticeAnalysisRejected) handleRejectTaxNotice() {}

  validatedTaxNotice(scoringData: FiscalData) {
    this.applyChange(
      new TaxNoticeAnalysisSucceeded({
        globalGrossIncome: scoringData.globalGrossIncome,
        personalSituationCode: scoringData.personalSituationCode,
      }),
    );
  }

  @Handle(TaxNoticeAnalysisSucceeded)
  handleValidatedTaxNotice(event: TaxNoticeAnalysisSucceeded) {
    this.props.informations.fiscalReference = {
      ...this.props.informations.fiscalReference,
      ...event.props,
    };
  }

  updateStatus(newStatus?: ProfileStatus) {
    const profileStatus =
      newStatus || StatusStrategy.nextStatus(this.props.informations.status, this.props.kyc);
    if (profileStatus && profileStatus !== this.props.informations.status)
      this.applyChange(new ProfileStatusChanged({ status: profileStatus }));
  }

  @Handle(ProfileStatusChanged)
  applyProfileStatusChanged(event: ProfileStatusChanged): void {
    this.props.informations.status = event.props.status;
  }

  uploadTaxNotice(taxNotice: ProfileDocument) {
    this.applyChange(new TaxNoticeUploaded({ document: taxNotice.props }));
  }

  @Handle(TaxNoticeUploaded)
  applyUploadTaxNotice(): void {
    this.props.kyc.taxNoticeUploaded = true;
  }
}
