import { configureEventHandler } from '@oney/messages-adapters';
import { Container } from 'inversify';
import { OtScoringReceived } from '@oney/profile-messages';
import { ProfileCoreConfiguration } from '@oney/profile-core';
import { ScoringReceivedHandler } from './ScoringReceivedHandler';

export async function buildOneyTrustEventHandlers(container: Container, config: ProfileCoreConfiguration) {
  await configureEventHandler(container, em => {
    em.register(OtScoringReceived, ScoringReceivedHandler, { topic: config.serviceBusProfileAzfTopic });
  });
}
