import { Container } from 'inversify';
import { configureEventHandler } from '@oney/messages-adapters';
import { UpdateProfileStatusCommand } from '@oney/profile-messages';
import { ProfileCoreConfiguration } from '@oney/profile-core';
import { UpdateProfileStatusCommandHandler } from './UpdateProfileStatusCommandHandler';

export async function buildSagaCommandsHandlers(container: Container, config: ProfileCoreConfiguration) {
  await configureEventHandler(container, em => {
    em.register(UpdateProfileStatusCommand, UpdateProfileStatusCommandHandler, {
      topic: config.serviceBusTopic,
    });
  });
}
