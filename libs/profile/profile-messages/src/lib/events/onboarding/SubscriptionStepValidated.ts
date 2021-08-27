import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { DomainEvent, DomainEventMetadata } from '@oney/ddd';

@DecoratedEvent({ version: 1, name: 'SUBSCRIPTION_STEP_VALIDATED', namespace: '@oney/profile' })
export class SubscriptionStepValidated implements DomainEvent<null> {
  id: string = uuidv4();

  props: null;
  metadata?: DomainEventMetadata;
}
