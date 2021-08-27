import { Event } from '@oney/messages-core';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidV4 } from 'uuid';

export interface CustomerServiceDemandSentProps {
  firstname: string;
  lastname: string;
  birthname?: string;
  email: string;
  phone: string;
  gender: string;
  userId?: string; // if user is connected
  topic: string;
  demand: string;
}

@DecoratedEvent({ version: 1, name: 'CUSTOMER_SERVICE_DEMAND_SENT', namespace: '@oney/profile' })
export class CustomerServiceDemandSent implements Event<CustomerServiceDemandSentProps> {
  id = uuidV4();

  props: CustomerServiceDemandSentProps;

  constructor(props: CustomerServiceDemandSentProps) {
    this.props = { ...props };
  }
}
