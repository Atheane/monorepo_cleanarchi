import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { DomainEvent, DomainEventMetadata } from '@oney/ddd';

export interface EvaluateBankAccountToUncapLimitsProps {
  uid: string;
}

@DecoratedEvent({ version: 1, name: 'EVALUATE_BANK_ACCOUNT_TO_UNCAP_LIMITS', namespace: '@oney/payment' })
export class EvaluateBankAccountToUncapLimits implements DomainEvent<EvaluateBankAccountToUncapLimitsProps> {
  id: string = uuidv4();
  props: EvaluateBankAccountToUncapLimitsProps;
  metadata?: DomainEventMetadata;

  constructor(props: EvaluateBankAccountToUncapLimitsProps) {
    this.props = { ...props };
  }
}
