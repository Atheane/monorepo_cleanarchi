import { v4 as uuidv4 } from 'uuid';
import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { ProvisioningEventName } from '../types/ProvisioningEventName';
import { Domain } from '../types/Domain';
import { Provisioning } from '../types/Provisioning';

export interface PhoneProvisionedProperties {
  phone: string;
  phoneProvisioning: Provisioning;
}

@DecoratedEvent({
  version: 1,
  name: ProvisioningEventName.PHONE_PROVISIONED,
  namespace: Domain.AUTHENTICATION,
})
export class PhoneProvisioned implements DomainEvent<PhoneProvisionedProperties> {
  id: string = uuidv4();
  metadata?: DomainEventMetadata;
  props: PhoneProvisionedProperties;

  constructor(props: PhoneProvisionedProperties) {
    this.props = props;
  }
}
