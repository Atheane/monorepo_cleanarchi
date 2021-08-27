import { BankAccountAggregated } from '@oney/aggregation-messages';
import { AccountEligibilityCalculated } from '@oney/cdp-messages';
import { DefaultTopicProviderFromEvent } from '@oney/messages-adapters';
import { EventCtor, SymTopicProviderFromEventCtor } from '@oney/messages-core';
import { LcbFtUpdated } from '@oney/payment-messages';
import { Container } from 'inversify';
import {
  IdentityDocumentValidated,
  OtScoringReceived,
  ProfileActivated,
  ProfileCreated,
  ProfileRejected,
  ProfileStatusChanged,
  TaxNoticeUploaded,
} from '@oney/profile-messages';
import { configureSaga } from '@oney/saga-adapters';
import { ProfileStatusSaga } from './ProfileStatusSaga';

export async function buildProfileSaga(container: Container) {
  console.log('######### SAGA CONF START #######');

  // istanbul ignore next
  if (!container.isBound(SymTopicProviderFromEventCtor)) {
    container.bind(SymTopicProviderFromEventCtor).to(DefaultTopicProviderFromEvent);
  }

  await configureSaga(container, r => {
    r.register(ProfileStatusSaga, {
      eventTopicMap: new Map<EventCtor, string>([
        [ProfileCreated, 'odb_profile_topic'],
        [OtScoringReceived, 'odb_profile_topic'],
        [IdentityDocumentValidated, 'odb_profile_topic'],
        [TaxNoticeUploaded, 'odb_profile_topic'],
        [LcbFtUpdated, 'odb_payment_topic'],
        [AccountEligibilityCalculated, 'odb_cdp_topic'],
        [BankAccountAggregated, 'odb_aggregation_topic'],
        [ProfileActivated, 'odb_profile_topic'],
        [ProfileStatusChanged, 'odb_profile_topic'],
        [ProfileRejected, 'odb_profile_topic'],
      ]),
    });
  });

  console.log('######### SAGA CONF END #######');
}
