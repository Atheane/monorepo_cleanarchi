import {
  Handle,
  Saga,
  SagaExecutionContext,
  SagaPropertyMapper,
  SagaState,
  SagaWorkflow,
  StartedBy,
} from '@oney/saga-core';
import { OfferType, CreateMembership, SubscriptionActivated } from '@oney/subscription-messages';
import { BankAccountOpened, CardCreated } from '@oney/payment-messages';
import {
  AddressStepValidated,
  CivilStatusValidated,
  PhoneStepValidated,
  ProfileCreated,
} from '@oney/profile-messages';
import {
  ProfileInformation,
  BankAccountInformation,
  CreditCardInformation,
  CreateMembershipCommand,
} from '@oney/subscription-messages';

export interface CreateMembershipInsuranceSagasState extends SagaState {
  subscriberId: string;
  offerType: OfferType;
  profile: ProfileInformation;
  bankAccountInfo: BankAccountInformation;
  creditCardInfo: CreditCardInformation;
}

@Saga({ id: 'create-membership-insurance', namespace: '@oney/subscription', version: 0 })
export class CreateMembershipInsuranceSagas extends SagaWorkflow<CreateMembershipInsuranceSagasState> {
  public id: string;
  public version: number;

  constructor() {
    super();
  }

  protected configureHowToFindSaga(mapper: SagaPropertyMapper<CreateMembershipInsuranceSagasState>): void {
    mapper
      .configureMapping(ProfileCreated)
      .fromEvent(message => message.props.uid)
      .toSaga(sagaData => sagaData.subscriberId);

    mapper
      .configureMapping(PhoneStepValidated)
      .fromEvent(message => message.metadata.aggregateId)
      .toSaga(sagaData => sagaData.subscriberId);

    mapper
      .configureMapping(CivilStatusValidated)
      .fromEvent(message => message.metadata.aggregateId)
      .toSaga(sagaData => sagaData.subscriberId);

    mapper
      .configureMapping(AddressStepValidated)
      .fromEvent(message => message.metadata.aggregateId)
      .toSaga(sagaData => sagaData.subscriberId);

    mapper
      .configureMapping(BankAccountOpened)
      .fromEvent(message => message.props.uid)
      .toSaga(sagaData => sagaData.subscriberId);

    mapper
      .configureMapping(CardCreated)
      .fromEvent(message => message.props.ownerId)
      .toSaga(sagaData => sagaData.subscriberId);

    mapper
      .configureMapping(SubscriptionActivated)
      .fromEvent(message => message.props.subscriberId)
      .toSaga(sagaData => sagaData.subscriberId);
  }

  @StartedBy(ProfileCreated)
  async handleProfileCreated(event: ProfileCreated) {
    const { uid, email } = event.props;
    this.state.subscriberId = uid;
    this.state.profile = {
      honorificCode: null,
      firstName: null,
      legalName: null,
      birthDate: null,
      email,
      phone: null,
      address: null,
    };
  }

  @Handle(PhoneStepValidated)
  async handleProfilePhoneValidated(event: PhoneStepValidated) {
    const { phone } = event.props;
    this.state.profile.phone = phone;
  }

  @Handle(CivilStatusValidated)
  async handleProfileCivilStatusValidated(event: CivilStatusValidated) {
    const { honorificCode, firstName, birthName, legalName, birthDate } = event.props;
    this.state.profile.honorificCode = honorificCode;
    this.state.profile.firstName = firstName;
    this.state.profile.legalName = legalName ? legalName : birthName;
    this.state.profile.birthDate = birthDate;
  }

  @Handle(AddressStepValidated)
  async handleProfileAddressValidated(event: AddressStepValidated) {
    const { street, additionalStreet, city, zipCode, country } = event.props;
    this.state.profile.address = { street, additionalStreet, city, zipCode, country };
  }

  @Handle(BankAccountOpened)
  async handleBankAccountOpened(event: BankAccountOpened) {
    const { iban, bic } = event.props;
    this.state.bankAccountInfo = { iban, bic };
  }

  @Handle(CardCreated)
  async handleCardOrderedSucceed(event: CardCreated) {
    const { pan } = event.props;
    this.state.creditCardInfo = { pan };
  }

  @Handle(SubscriptionActivated)
  async handleSubscriptionActivated(
    event: SubscriptionActivated,
    context: SagaExecutionContext<CreateMembershipInsuranceSagasState>,
  ) {
    const createMembershipCommand: CreateMembershipCommand = {
      subscriptionId: event.metadata.aggregateId,
      profileInfo: this.state.profile,
      bankAccountInfo: this.state.bankAccountInfo,
      creditCardInfo: this.state.creditCardInfo,
    };
    await context.eventDispatcher.dispatch(new CreateMembership(createMembershipCommand));
    this.markAsComplete();
  }
}
