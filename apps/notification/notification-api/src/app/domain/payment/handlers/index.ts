import { Topic } from '@oney/core';
import { EventManagerRegister } from '@oney/messages-adapters';
import {
  BankAccountMonthlyAllowanceUpdated,
  BankAccountUncappedFromAggregation,
  DebtCreated,
  DebtUpdated,
  PaymentCreated,
  TransferCreated,
  UncappingStateChanged,
} from '@oney/payment-messages';
import { BankAccountMonthlyAllowanceUpdatedHandler } from './BankAccountMonthlyAllowanceUpdatedHandler';
import { BankAccountUncappedFromAggregationHandler } from './BankAccountUncappedFromAggregationHandler';
import { PaymentDebtCreatedHandler } from './PaymentDebtCreatedHandler';
import { PaymentDebtUpdatedHandler } from './PaymentDebtUpdatedHandler';
import { PaymentTransferCreatedHandler } from './PaymentTransferCreatedHandler';
import { UncappingStateChangedHandler } from './UncappingStateChangedHandler';
import { PaymentCreatedHandler } from '../../transaction/handlers/PaymentCreatedHandler';

export async function initPaymentSubscribers(em: EventManagerRegister, odbPaymentTopic: Topic) {
  em.register(PaymentCreated, PaymentCreatedHandler, { topic: odbPaymentTopic });
  em.register(DebtCreated, PaymentDebtCreatedHandler, { topic: odbPaymentTopic });
  em.register(DebtUpdated, PaymentDebtUpdatedHandler, { topic: odbPaymentTopic });
  em.register(BankAccountMonthlyAllowanceUpdated, BankAccountMonthlyAllowanceUpdatedHandler, {
    topic: odbPaymentTopic,
  });
  em.register(TransferCreated, PaymentTransferCreatedHandler, { topic: odbPaymentTopic });
  em.register(BankAccountUncappedFromAggregation, BankAccountUncappedFromAggregationHandler, {
    topic: odbPaymentTopic,
  });
  em.register(UncappingStateChanged, UncappingStateChangedHandler, { topic: odbPaymentTopic });
}
