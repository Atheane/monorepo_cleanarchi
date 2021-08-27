import { Container } from 'inversify';
import { configureEventHandler, EventManager } from '@oney/messages-adapters';
import { ContractSigned, ProfileCreated } from '@oney/profile-messages';
import { ProfileCreatedHandler } from './ProfileCreatedHandler';
import { ContractSignedHandler } from './ContractSignedHandler';

export async function buildProfileHandlers(container: Container, config: { odbProfileTopic: string }) {
  await configureEventHandler(container, (em: EventManager) => {
    em.register(ProfileCreated, ProfileCreatedHandler, {
      topic: config.odbProfileTopic,
    });
    em.register(ContractSigned, ContractSignedHandler, {
      topic: config.odbProfileTopic,
    });
  });
}
