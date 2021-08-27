import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { ContractStatus } from '../../../types/ContractStatus';
import { PaymentExecution } from '../../../types/PaymentExecution';
import { SplitProduct } from '../../../types/SplitProduct';
import { CreditEvents } from '../../CreditEvents';

export type SplitPaymentScheduleUpdatedProperties = {
  id: string;
  contractNumber: string;
  bankAccountId: string;
  userId: string;
  productCode: SplitProduct;
  status: ContractStatus;
  fundingExecution: PaymentExecution;
  paymentsExecution: PaymentExecution[];
  initialTransactionId?: string;
};

@DecoratedEvent({ version: 1, name: CreditEvents.PAYMENT_SCHEDULE_UPDATED, namespace: '@oney/credit' })
export class SplitPaymentScheduleUpdated implements DomainEvent<SplitPaymentScheduleUpdatedProperties> {
  id: string = uuidv4();

  props: SplitPaymentScheduleUpdatedProperties;

  metadata?: DomainEventMetadata;

  constructor(props: SplitPaymentScheduleUpdatedProperties) {
    this.props = { ...props };
  }
}
