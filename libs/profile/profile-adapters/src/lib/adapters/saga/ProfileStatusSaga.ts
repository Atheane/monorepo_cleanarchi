import {
  Handle,
  Saga,
  SagaExecutionContext,
  SagaPropertyMapper,
  SagaWorkflow,
  StartedBy,
} from '@oney/saga-core';
import {
  IdentityDocumentValidated,
  OtScoringReceived,
  ProfileActivated,
  ProfileCreated,
  ProfileRejected,
  ProfileStatus,
  ProfileStatusChanged,
  TaxNoticeUploaded,
} from '@oney/profile-messages';
import { DomainEvent } from '@oney/ddd';
import { AccountEligibilityCalculated } from '@oney/cdp-messages';
import { BankAccountAggregated } from '@oney/aggregation-messages';
import { LcbFtUpdated } from '@oney/payment-messages';
import { profileStatusSagaFinder } from './ProfileStatusSagaFinder';
import { CheckEligibilityStrategy } from './profileStatusStrategy/CheckEligibilityStrategy';
import { ProfileSagaState } from './types/ProfileSagaState';
import { StatusStrategy } from './profileStatusStrategy/StatusStrategy';
import { Eligibility } from './types/Eligibility';
import { Scoring } from './types/Scoring';

@Saga({ id: 'profile-status-saga', namespace: '@oney/profile', version: 0 })
export class ProfileStatusSaga extends SagaWorkflow<ProfileSagaState> {
  public id: string;
  public version: number;

  protected configureHowToFindSaga(mapper: SagaPropertyMapper<ProfileSagaState>) {
    profileStatusSagaFinder(mapper);
  }

  @StartedBy(ProfileCreated)
  async handleProfileCreated(event: ProfileCreated) {
    console.log('saga starting by ProfileCreated event', event);
    this.state = {
      ...this.state,
      uid: event.metadata.aggregateId,
      status: event.props.status,
      amlReceived: false,
      eligibilityReceived: false,
      taxNoticeUploaded: false,
    };
  }

  @Handle(OtScoringReceived)
  async handleUserKycDecisionUpdated(
    event: OtScoringReceived,
    context: SagaExecutionContext<ProfileSagaState>,
  ) {
    console.log('saga handling OtScoringReceived event', event);
    const { fraud, compliance, decision } = event.props;
    const scoring: Scoring = { fraud, compliance, decision };
    this.state = { ...this.state, scoring };

    const statusStrategy = new StatusStrategy(this.state.status);
    const nextCommand: DomainEvent = statusStrategy.strategy.nextCommand(this.state);

    console.log('saga OtScoringReceived handler dispatching command', nextCommand);
    await context.eventDispatcher.dispatch(nextCommand);
  }

  @Handle(IdentityDocumentValidated)
  async handleIdentityDocumentValidated(
    event: IdentityDocumentValidated,
    context: SagaExecutionContext<ProfileSagaState>,
  ) {
    console.log('saga handling IdentityDocumentValidated event', event);

    const statusStrategy = new StatusStrategy(this.state.status);
    const nextCommand: DomainEvent = statusStrategy.strategy.nextCommand(this.state);

    console.log('saga IdentityDocumentValidated handler dispatching command', nextCommand);
    await context.eventDispatcher.dispatch(nextCommand);
  }

  @Handle(TaxNoticeUploaded)
  async handleTaxNoticeUploaded(event: TaxNoticeUploaded, context: SagaExecutionContext<ProfileSagaState>) {
    console.log('saga handling TaxNoticeUploaded event', event);

    const statusStrategy = new StatusStrategy(this.state.status);
    const nextCommand: DomainEvent = statusStrategy.strategy.nextCommand(this.state);

    console.log('saga TaxNoticeUploaded handler dispatching command', nextCommand);
    await context.eventDispatcher.dispatch(nextCommand);
  }

  @Handle(LcbFtUpdated)
  async handleLcbFtUpdated(event: LcbFtUpdated, context: SagaExecutionContext<ProfileSagaState>) {
    console.log('saga handling LcbFtUpdated event', event);

    this.state = { ...this.state, amlReceived: true, risk: event.props.riskLevel };

    if (this.state.status === ProfileStatus.CHECK_REQUIRED_AML) {
      const statusStrategy = new StatusStrategy(this.state.status);
      const nextCommand: DomainEvent = statusStrategy.strategy.nextCommand(this.state);

      console.log('saga LcbFtUpdated handler dispatching command', nextCommand);
      await context.eventDispatcher.dispatch(nextCommand);
    }
  }

  @Handle(AccountEligibilityCalculated)
  async handleAccountEligibilityCalculated(
    event: AccountEligibilityCalculated,
    context: SagaExecutionContext<ProfileSagaState>,
  ) {
    console.log('saga handling AccountEligibilityCalculated event', event);

    const eligibility: Eligibility = { accountEligibility: event.props.eligibility };
    this.state = { ...this.state, eligibility, eligibilityReceived: true };

    if (this.state.status === ProfileStatus.CHECK_ELIGIBILITY) {
      const statusStrategy = new CheckEligibilityStrategy();
      const nextCommand: DomainEvent = statusStrategy.nextCommand(this.state);

      console.log('saga AccountEligibilityCalculated handler dispatching command', nextCommand);
      await context.eventDispatcher.dispatch(nextCommand);
    }
  }

  @Handle(BankAccountAggregated)
  async handleBankAccountAggregated(
    event: BankAccountAggregated,
    context: SagaExecutionContext<ProfileSagaState>,
  ) {
    console.log('saga handling BankAccountAggregated event', event);
    const statusStrategy = new StatusStrategy(this.state.status);
    const nextCommand: DomainEvent = statusStrategy.strategy.nextCommand(this.state);

    console.log('saga BankAccountAggregated handler dispatching command', nextCommand);
    await context.eventDispatcher.dispatch(nextCommand);
  }

  @Handle(ProfileStatusChanged)
  async handleProfileStatusChanged(event: ProfileStatusChanged) {
    console.log('saga handling ProfileStatusChanged event', event);
    this.state = { ...this.state, status: event.props.status };
  }

  @Handle(ProfileActivated)
  async handleProfileActivated(event: ProfileActivated) {
    console.log('saga completing by ProfileActivated event', event);
    this.state = { ...this.state, status: event.props.profileStatus };
    this.markAsComplete();
  }

  @Handle(ProfileRejected)
  async handleProfileRejected(event: ProfileActivated) {
    console.log('saga completing by ProfileRejected event', event);
    this.state = { ...this.state, status: ProfileStatus.REJECTED };
    this.markAsComplete();
  }
}
