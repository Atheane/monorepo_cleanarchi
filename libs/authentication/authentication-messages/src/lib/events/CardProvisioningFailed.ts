import { v4 as uuidv4 } from 'uuid';
import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { ProvisioningStep } from '../types/ProvisioningStep';
import { ProvisioningError } from '../types/ProvisioningError';
import { ProvisioningEventName } from '../types/ProvisioningEventName';
import { Domain } from '../types/Domain';

export interface CardProvisioningFailedProps extends ProvisioningError {
  step: ProvisioningStep;
}

@DecoratedEvent({
  version: 1,
  name: ProvisioningEventName.CARD_PROVISIONING_FAILED,
  namespace: Domain.AUTHENTICATION,
})
export class CardProvisioningFailed implements DomainEvent<CardProvisioningFailedProps> {
  id: string = uuidv4();

  props: CardProvisioningFailedProps;

  metadata?: DomainEventMetadata;

  constructor(props: CardProvisioningFailedProps) {
    this.props = props;
  }
}
