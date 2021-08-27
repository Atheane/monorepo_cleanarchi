import { Invitation, StrongAuthVerifier, User } from '@oney/authentication-core';
import { configureInMemoryEventHandlerExecution, createAzureConnection } from '@oney/az-servicebus-adapters';
import { defaultLogger } from '@oney/logger-adapters';
import { EventHandlerExecutionFinder, EventHandlerExecutionStore } from '@oney/messages-core';
import { testConfiguration } from './config/config';
import { DomainConfiguration } from '../../adapters/models/DomainConfiguration';
import { AuthenticationBuildDependencies } from '../../di/AuthenticationBuildDependencies';

export type Params = {
  configuration?: DomainConfiguration;
  authAccessServiceKey?: string;
  invitationMap?: Map<string, Invitation>;
  verifierMap?: Map<string, StrongAuthVerifier>;
  userMap?: Map<string, User>;
};

export async function initializeInMemoryAuthenticationBuildDependencies(params?: Params) {
  const innerVerifierMap = new Map<string, StrongAuthVerifier>();
  const innerInvitationMap = new Map<string, Invitation>();
  const innerUserMap = new Map<string, User>();

  const computed = {
    configuration: testConfiguration,
    authAccessServiceKey: 'authAccessServiceKey',
    verifierMap: innerVerifierMap,
    invitationMap: innerInvitationMap,
    userMap: innerUserMap,
    ...params,
  };

  beforeEach(() => {
    innerVerifierMap.clear();
    innerInvitationMap.clear();
    innerUserMap.clear();
  });

  const kernel = new AuthenticationBuildDependencies(computed.configuration);

  configureInMemoryEventHandlerExecution(kernel);

  await kernel
    .addMessagingPlugin(
      createAzureConnection(
        computed.configuration.eventConfiguration.serviceBusConnectionString,
        computed.configuration.eventConfiguration.subscription,
        computed.configuration.authenticationTopic,
        defaultLogger,
        kernel.get(EventHandlerExecutionFinder),
        kernel.get(EventHandlerExecutionStore),
      ),
    )
    .initStorageDependencies(computed.authAccessServiceKey, computed.configuration.frontDoorApiBaseUrl)
    .inMemory({
      invitationMap: computed.invitationMap,
      verifierMap: computed.verifierMap,
      userMap: computed.userMap,
    });

  kernel.bindDependencies(computed.authAccessServiceKey);

  return {
    kernel,
    authAccessServiceKey: computed.authAccessServiceKey,
    invitationMap: computed.invitationMap,
    verifierMap: computed.verifierMap,
    userMap: computed.userMap,
  };
}
