import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { ProfileStatus } from '../types/ProfileStatus';

export enum LcbFtRiskLevel {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

export interface MoneyLaunderingRiskUpdatedProps {
  status: ProfileStatus;
  moneyLaunderingRisk: LcbFtRiskLevel;
}

@DecoratedEvent({ version: 1, name: 'MONEY_LAUNDERING_RISK_UPDATED', namespace: '@oney/profile' })
export class MoneyLaunderingRiskUpdated implements DomainEvent<MoneyLaunderingRiskUpdatedProps> {
  id: string = uuidv4();

  props: MoneyLaunderingRiskUpdatedProps;

  metadata?: DomainEventMetadata;

  constructor(props: MoneyLaunderingRiskUpdatedProps) {
    this.props = { ...props };
  }
}
