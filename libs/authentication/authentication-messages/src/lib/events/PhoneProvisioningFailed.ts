import { v4 as uuidv4 } from 'uuid';
import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { ProvisioningError } from '../types/ProvisioningError';
import { ProvisioningEventName } from '../types/ProvisioningEventName';
import { Domain } from '../types/Domain';

export interface PhoneProvisioningFailedProperties extends ProvisioningError {
  phone: string;
}

@DecoratedEvent({
  version: 1,
  name: ProvisioningEventName.PHONE_PROVISIONING_FAILED,
  namespace: Domain.AUTHENTICATION,
})
export class PhoneProvisioningFailed implements DomainEvent<PhoneProvisioningFailedProperties> {
  id: string = uuidv4();

  props: PhoneProvisioningFailedProperties;

  metadata?: DomainEventMetadata;

  constructor(props: PhoneProvisioningFailedProperties) {
    this.props = props;
  }
}
