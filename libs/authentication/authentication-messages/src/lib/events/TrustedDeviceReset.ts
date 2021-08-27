import { v4 as uuidv4 } from 'uuid';
import { DecoratedEvent } from '@oney/messages-core';
import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { Domain } from '../types/Domain';
import { UserEventName } from '../types/UserEventName';

export interface TrustedDeviceResetProperties {
  deviceId: string;
}

@DecoratedEvent({
  version: 1,
  name: UserEventName.TRUSTED_DEVICE_RESET,
  namespace: Domain.AUTHENTICATION,
})
export class TrustedDeviceReset implements DomainEvent<TrustedDeviceResetProperties> {
  id: string = uuidv4();
  props: TrustedDeviceResetProperties;
  metadata?: DomainEventMetadata;

  constructor(props: TrustedDeviceResetProperties) {
    this.props = props;
  }
}
