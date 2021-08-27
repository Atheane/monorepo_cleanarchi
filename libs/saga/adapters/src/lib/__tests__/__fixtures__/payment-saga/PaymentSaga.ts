/* eslint @typescript-eslint/no-unused-vars: 0 */

import {
  Handle,
  Saga,
  SagaExecutionContext,
  SagaPropertyMapper,
  SagaState,
  SagaWorkflow,
  StartedBy,
  Timeout,
} from '@oney/saga-core';
import { Duration } from 'luxon';
import { v4 } from 'uuid';
import { AggregatedAccountsIncomesChecked } from './messages/AggregatedAccountsIncomesChecked';
import { AggregatedAccountsIncomesFailed } from './messages/AggregatedAccountsIncomesFailed';
import { AggregatedAccountsIncomesTimeout } from './messages/AggregatedAccountsIncomesTimeout';
import { CheckAggregatedAccountsIncomes } from './messages/CheckAggregatedAccountsIncomes';
import { IncomingFrontEvent } from './messages/IncomingFrontEvent';
import { PaymentAccountLimitCalculated } from './messages/PaymentAccountLimitCalculated';
import { PaymentAccountLimitFailed } from './messages/PaymentAccountLimitFailed';
import { PostAlgoanFailure } from './messages/PostAlgoanFailure';
import { RequestAlgoanCalculation } from './messages/RequestAlgoanCalculation';
import { RequestSMOGlobalOutUpdate } from './messages/RequestSMOGlobalOutUpdate';
import { SMOGlobalOutUpdated } from './messages/SMOGlobalOutUpdated';
import { SMOGlobalOutUpdateFailed } from './messages/SMOGlobalOutUpdateFailed';

export interface PaymentSagaState extends SagaState {
  userId: string;

  handleIncomingFrontEvent: boolean;
  handleAggregatedAccountsIncomesChecked: boolean;
  handleAggregatedAccountsIncomesFailed: boolean;
  handleAggregatedAccountsIncomesTimeout: boolean;
  handlePaymentAccountLimitCalculated: boolean;
  handlePaymentAccountLimitFailed: boolean;
  handlePostAlgoanFailure: boolean;
  handleSMOGlobalOutUpdated: boolean;
  handleSMOGlobalOutUpdateFailed: boolean;
}

@Saga({ id: 'payment-saga', namespace: '@oney/saga', version: 0 })
export class PaymentSaga extends SagaWorkflow<PaymentSagaState> {
  public id: string;
  public version: number;

  protected configureHowToFindSaga(mapper: SagaPropertyMapper<PaymentSagaState>): void {
    mapper
      .configureMapping(IncomingFrontEvent)
      .fromEvent(message => message.props.userId)
      .toSaga(sagaData => sagaData.userId);
    mapper
      .configureMapping(AggregatedAccountsIncomesChecked)
      .fromEvent(message => message.props.userId)
      .toSaga(sagaData => sagaData.userId);
    mapper
      .configureMapping(AggregatedAccountsIncomesFailed)
      .fromEvent(message => message.props.userId)
      .toSaga(sagaData => sagaData.userId);
    mapper
      .configureMapping(AggregatedAccountsIncomesTimeout)
      .fromEvent(message => message.props.userId)
      .toSaga(sagaData => sagaData.userId);
    mapper
      .configureMapping(PaymentAccountLimitCalculated)
      .fromEvent(message => message.props.userId)
      .toSaga(sagaData => sagaData.userId);
    mapper
      .configureMapping(PaymentAccountLimitCalculated)
      .fromEvent(message => message.props.userId)
      .toSaga(sagaData => sagaData.userId);
    mapper
      .configureMapping(PaymentAccountLimitFailed)
      .fromEvent(message => message.props.userId)
      .toSaga(sagaData => sagaData.userId);
    mapper
      .configureMapping(PostAlgoanFailure)
      .fromEvent(message => message.props.userId)
      .toSaga(sagaData => sagaData.userId);
    mapper
      .configureMapping(SMOGlobalOutUpdated)
      .fromEvent(message => message.props.userId)
      .toSaga(sagaData => sagaData.userId);
    mapper
      .configureMapping(SMOGlobalOutUpdateFailed)
      .fromEvent(message => message.props.userId)
      .toSaga(sagaData => sagaData.userId);
  }

  @StartedBy(IncomingFrontEvent)
  async handleIncomingFrontEvent(
    event: IncomingFrontEvent,
    context: SagaExecutionContext<PaymentSagaState>,
  ): Promise<void> {
    this.state.handleIncomingFrontEvent = true;
    this.state.userId = event.props.userId;

    await context.eventDispatcher.dispatch(
      new CheckAggregatedAccountsIncomes({
        props: {
          userId: event.props.userId,
        },
      }),
    );

    await this.requestTimeoutWithTimeoutMessage(
      context,
      Duration.fromMillis(10 * 60 * 1000),
      new AggregatedAccountsIncomesTimeout({
        id: v4(),
        props: event.props,
      }),
    );
  }

  @Handle(AggregatedAccountsIncomesChecked)
  async handleAggregatedAccountsIncomesChecked(
    event: AggregatedAccountsIncomesChecked,
    context: SagaExecutionContext<PaymentSagaState>,
  ): Promise<void> {
    this.state.handleAggregatedAccountsIncomesChecked = true;

    await context.eventDispatcher.dispatch(
      new RequestAlgoanCalculation({
        props: {
          userId: event.props.userId,
        },
      }),
    );
  }

  @Handle(AggregatedAccountsIncomesFailed)
  handleAggregatedAccountsIncomesFailed(
    event: AggregatedAccountsIncomesFailed,
    context: SagaExecutionContext<PaymentSagaState>,
  ): void {
    this.state.handleAggregatedAccountsIncomesFailed = true;
  }

  @Timeout(AggregatedAccountsIncomesTimeout)
  handleAggregatedAccountsIncomesTimeout(
    event: AggregatedAccountsIncomesTimeout,
    context: SagaExecutionContext<PaymentSagaState>,
  ): void {
    this.state.handleAggregatedAccountsIncomesTimeout = true;
  }

  @Handle(PaymentAccountLimitCalculated)
  async handlePaymentAccountLimitCalculated(
    event: PaymentAccountLimitCalculated,
    context: SagaExecutionContext<PaymentSagaState>,
  ): Promise<void> {
    this.state.handlePaymentAccountLimitCalculated = true;

    await context.eventDispatcher.dispatch(
      new RequestSMOGlobalOutUpdate({
        props: {
          userId: event.props.userId,
        },
      }),
    );
  }

  @Handle(PaymentAccountLimitFailed)
  handlePaymentAccountLimitFailed(
    event: PaymentAccountLimitFailed,
    context: SagaExecutionContext<PaymentSagaState>,
  ): void {
    this.state.handlePaymentAccountLimitFailed = true;
  }

  @Handle(PostAlgoanFailure)
  handlePostAlgoanFailure(event: PostAlgoanFailure, context: SagaExecutionContext<PaymentSagaState>): void {
    this.state.handlePostAlgoanFailure = true;
  }

  @Handle(SMOGlobalOutUpdated)
  handleSMOGlobalOutUpdated(
    event: SMOGlobalOutUpdated,
    context: SagaExecutionContext<PaymentSagaState>,
  ): void {
    this.state.handleSMOGlobalOutUpdated = true;
  }

  @Handle(SMOGlobalOutUpdateFailed)
  handleSMOGlobalOutUpdateFailed(
    event: SMOGlobalOutUpdateFailed,
    context: SagaExecutionContext<PaymentSagaState>,
  ): void {
    this.state.handleSMOGlobalOutUpdateFailed = true;
  }
}
