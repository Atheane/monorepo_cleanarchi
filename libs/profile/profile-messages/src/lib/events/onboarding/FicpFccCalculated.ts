import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { DomainEvent, DomainEventMetadata } from '@oney/ddd';

export interface FicpFccCalculatedProps {
  uid: string;
  statusCode: number;
  creditIncident: boolean;
  paymentIncident?: boolean;
}

@DecoratedEvent({ version: 1, name: 'FICP_FCC_CALCULATED', namespace: '@oney/profile' })
export class FicpFccCalculated implements DomainEvent<FicpFccCalculatedProps> {
  id: string = uuidv4();

  props: FicpFccCalculatedProps;
  metadata: DomainEventMetadata;
  constructor(props: FicpFccCalculatedProps) {
    this.props = { ...props };
  }
}
