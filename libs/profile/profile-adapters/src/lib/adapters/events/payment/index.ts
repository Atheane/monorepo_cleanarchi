import { configureEventHandler } from '@oney/messages-adapters';
import { Container } from 'inversify';
import { BankAccountOpened, DiligenceSctInReceived, LcbFtUpdated } from '@oney/payment-messages';
import { ProfileCoreConfiguration } from '@oney/profile-core';
import { DiligenceSctInReceivedEventHandler } from './DiligenceSctInReceivedEventHandler';
import { LcbFtUpdatedEventHandler } from './LcbFtUpdatedEventHandler';
import { BankAccountOpenedEventHandler } from './BankAccountOpenedEventHandler';

export async function buildPaymentEventHandlers(container: Container, config: ProfileCoreConfiguration) {
  await configureEventHandler(container, em => {
    em.register(DiligenceSctInReceived, DiligenceSctInReceivedEventHandler, {
      topic: config.topicPaymentAzfEkyc,
    });
    em.register(LcbFtUpdated, LcbFtUpdatedEventHandler, { topic: config.topicPaymentAzfEkyc });
    em.register(BankAccountOpened, BankAccountOpenedEventHandler, { topic: config.odbPaymentTopic });
  });
}
