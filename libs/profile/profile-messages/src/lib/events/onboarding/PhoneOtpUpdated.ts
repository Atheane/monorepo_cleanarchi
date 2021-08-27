import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { DomainEvent, DomainEventMetadata } from '@oney/ddd';

export interface PhoneOtpUpdatedProps {
  uid: string;
  code: string;
  phone: string;
}

@DecoratedEvent({ version: 1, name: 'PHONE_OTP_UPDATED', namespace: '@oney/profile' })
export class PhoneOtpUpdated implements DomainEvent<PhoneOtpUpdatedProps> {
  id: string = uuidv4();

  props: PhoneOtpUpdatedProps;

  metadata: DomainEventMetadata;

  constructor(props: PhoneOtpUpdatedProps) {
    this.props = { ...props };
  }
}
