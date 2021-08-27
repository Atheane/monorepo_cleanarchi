import { BankAccountAggregated } from '@oney/aggregation-messages';
import { configureEventHandler } from '@oney/messages-adapters';
import { BankAccountAggregatedEventHandler } from '@oney/profile-adapters';
import { Container } from 'inversify';
import { ProfileCoreConfiguration } from '@oney/profile-core';

export async function buildAggregationEventHandlers(container: Container, config: ProfileCoreConfiguration) {
  await configureEventHandler(container, em => {
    em.register(BankAccountAggregated, BankAccountAggregatedEventHandler, {
      topic: config.topicOdbAggregation,
    });
  });
}
