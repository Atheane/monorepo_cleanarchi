import { configureEventHandler } from '@oney/messages-adapters';
import { Container } from 'inversify';
import { AccountEligibilityCalculated, PreEligibilityOK } from '@oney/cdp-messages';
import { ProfileCoreConfiguration } from '@oney/profile-core';
import { AccountEligibilityCalculatedEventHandler } from './AccountEligibilityCalculatedEventHandler';
import { PreEligibilityOKEventHandler } from './PreEligibilityOKEventHandler';

export async function buildCdpEventHandlers(container: Container, config: ProfileCoreConfiguration) {
  await configureEventHandler(container, em => {
    em.register(AccountEligibilityCalculated, AccountEligibilityCalculatedEventHandler, {
      topic: config.odbCdpTopic,
    });
    em.register(PreEligibilityOK, PreEligibilityOKEventHandler, {
      topic: config.odbCdpTopic,
    });
  });
}
