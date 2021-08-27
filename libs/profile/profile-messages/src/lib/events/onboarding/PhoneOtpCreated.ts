import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { DomainEvent, DomainEventMetadata } from '@oney/ddd';

export interface PhoneOtpCreatedProps {
  uid: string;
  code: string;
  phone: string;
}

@DecoratedEvent({ version: 1, name: 'PHONE_OTP_CREATED', namespace: '@oney/profile' })
export class PhoneOtpCreated implements DomainEvent<PhoneOtpCreatedProps> {
  id: string = uuidv4();

  props: PhoneOtpCreatedProps;

  metadata: DomainEventMetadata;

  constructor(props: PhoneOtpCreatedProps) {
    this.props = { ...props };
  }
}
