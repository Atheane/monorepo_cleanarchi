import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { ContractStatus } from '../../../types/ContractStatus';
import { PaymentExecution } from '../../../types/PaymentExecution';
import { SplitProduct } from '../../../types/SplitProduct';

export type SplitPaymentScheduleCreatedProperties = {
  id: string;
  userId: string;
  contractNumber: string;
  bankAccountId: string;
  productCode: SplitProduct;
  status: ContractStatus;
  apr: number;
  fundingExecution?: PaymentExecution;
  paymentsExecution?: PaymentExecution[];
  label: string;
};

@DecoratedEvent({ version: 1, name: 'PAYMENT_SCHEDULE_CREATED', namespace: '@oney/credit' })
export class SplitPaymentScheduleCreated implements DomainEvent<SplitPaymentScheduleCreatedProperties> {
  id: string = uuidv4();

  props: SplitPaymentScheduleCreatedProperties;

  metadata?: DomainEventMetadata;

  constructor(props: SplitPaymentScheduleCreatedProperties) {
    this.props = { ...props };
  }
}
