import { v4 as uuidv4 } from 'uuid';
import { DecoratedEvent } from '@oney/messages-core';
import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { Domain } from '../types/Domain';
import { UserEventName } from '../types/UserEventName';

export interface DeviceTrustedProperties {
  isSet: boolean;
  value: string;
  deviceId: string;
}

@DecoratedEvent({
  version: 1,
  name: UserEventName.DEVICE_TRUSTED,
  namespace: Domain.AUTHENTICATION,
})
export class DeviceTrusted implements DomainEvent<DeviceTrustedProperties> {
  id: string = uuidv4();
  props: DeviceTrustedProperties;
  metadata?: DomainEventMetadata;

  constructor(props: DeviceTrustedProperties) {
    this.props = props;
  }
}
