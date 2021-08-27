import { SagaPropertyMapper } from '@oney/saga-core';
import {
  IdentityDocumentValidated,
  OtScoringReceived,
  ProfileActivated,
  ProfileCreated,
  ProfileRejected,
  ProfileStatusChanged,
  TaxNoticeUploaded,
} from '@oney/profile-messages';
import { BankAccountAggregated } from '@oney/aggregation-messages';
import { AccountEligibilityCalculated } from '@oney/cdp-messages';
import { LcbFtUpdated } from '@oney/payment-messages';
import { ProfileSagaState } from './types/ProfileSagaState';

export function profileStatusSagaFinder(mapper: SagaPropertyMapper<ProfileSagaState>) {
  mapper
    .configureMapping(ProfileCreated)
    .fromEvent(message => message.metadata.aggregateId)
    .toSaga(sagaData => sagaData.uid);

  mapper
    .configureMapping(OtScoringReceived)
    .fromEvent(message => message.props.uid)
    .toSaga(sagaData => sagaData.uid);

  mapper
    .configureMapping(IdentityDocumentValidated)
    .fromEvent(message => message.metadata.aggregateId)
    .toSaga(sagaData => sagaData.uid);

  mapper
    .configureMapping(TaxNoticeUploaded)
    .fromEvent(message => message.metadata.aggregateId)
    .toSaga(sagaData => sagaData.uid);

  mapper
    .configureMapping(LcbFtUpdated)
    .fromEvent(message => message.props.appUserId)
    .toSaga(sagaData => sagaData.uid);

  mapper
    .configureMapping(AccountEligibilityCalculated)
    .fromEvent(message => message.metadata.aggregateId)
    .toSaga(sagaData => sagaData.uid);

  mapper
    .configureMapping(BankAccountAggregated)
    .fromEvent(message => message.props.userId)
    .toSaga(sagaData => sagaData.uid);

  mapper
    .configureMapping(ProfileActivated)
    .fromEvent(message => message.metadata.aggregateId)
    .toSaga(sagaData => sagaData.uid);

  mapper
    .configureMapping(ProfileStatusChanged)
    .fromEvent(message => message.metadata.aggregateId)
    .toSaga(sagaData => sagaData.uid);

  mapper
    .configureMapping(ProfileRejected)
    .fromEvent(message => message.metadata.aggregateId)
    .toSaga(sagaData => sagaData.uid);
}
