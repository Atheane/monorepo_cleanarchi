import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { HonorificCode } from '../types/HonorificCode';

export interface CivilStatusValidatedProps {
  honorificCode: HonorificCode;
  firstName: string;
  legalName: string;
  birthName: string;
  birthDate: Date;
  birthCountry: string;
  birthCity: string;
  nationalityCountryCode: string;
}

@DecoratedEvent({ version: 1, name: 'CIVIL_STATUS_VALIDATED', namespace: '@oney/profile' })
export class CivilStatusValidated implements DomainEvent<CivilStatusValidatedProps> {
  id: string = uuidv4();

  props: CivilStatusValidatedProps;
  metadata?: DomainEventMetadata;
  constructor(props: CivilStatusValidatedProps) {
    this.props = { ...props };
  }
}
