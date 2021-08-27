import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { FiscalReference } from './types/FiscalReference';
import { DeclarativeFiscalSituation } from './types/DeclarativeFiscalSituation';

export interface FiscalStatusValidatedProps {
  fiscalDeclaration: DeclarativeFiscalSituation;
  fiscalReference: FiscalReference;
}

@DecoratedEvent({ version: 1, name: 'FISCAL_STATUS_VALIDATED', namespace: '@oney/profile' })
export class FiscalStatusValidated implements DomainEvent<FiscalStatusValidatedProps> {
  id: string = uuidv4();

  props: FiscalStatusValidatedProps;
  metadata?: DomainEventMetadata;
  constructor(props: FiscalStatusValidatedProps) {
    this.props = { ...props };
  }
}
