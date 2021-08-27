/* eslint @typescript-eslint/no-unused-vars: 0 */

import {
  Handle,
  Saga,
  SagaExecutionContext,
  SagaPropertyMapper,
  SagaState,
  SagaWorkflow,
  StartedBy,
} from '@oney/saga-core';
import { CompleteOrder } from './events/CompleteOrder';
import { HandleByAllSampleSaga } from './events/HandleByAllSampleSaga';
import { StartOrder } from './events/StartOrder';
import { TouchOrder } from './events/TouchOrder';

export interface SampleSagaState extends SagaState {
  orderId: string;
  handleStartOrderCalled: boolean;
  handleTouchOrderCalled: boolean;
  handleCompleteOrderCalled: boolean;
  handleHandleByAllSampleSaga: boolean;
}

@Saga({ id: 'sample-saga', namespace: '@oney/saga', version: 0 })
export class SampleSaga extends SagaWorkflow<SampleSagaState> {
  protected configureHowToFindSaga(mapper: SagaPropertyMapper<SampleSagaState>): void {
    mapper
      .configureMapping(StartOrder)
      .fromEvent(message => message.props.orderId)
      .toSaga(sagaData => sagaData.orderId);

    mapper
      .configureMapping(TouchOrder)
      .fromEvent(message => message.props.orderId)
      .toSaga(sagaData => sagaData.orderId);

    mapper
      .configureMapping(CompleteOrder)
      .fromEvent(message => message.props.orderId)
      .toSaga(sagaData => sagaData.orderId);

    mapper
      .configureMapping(HandleByAllSampleSaga)
      .fromEvent(message => true)
      .toSaga(sagaData => true);
  }

  @StartedBy(StartOrder)
  handleStartOrder(event: StartOrder, context: SagaExecutionContext<SampleSagaState>): void {
    this.state.handleStartOrderCalled = true;
    this.state.handleCompleteOrderCalled = false;
    this.state.orderId = event.props.orderId;
  }

  @Handle(TouchOrder)
  handleTouchOrder(event: TouchOrder, context: SagaExecutionContext<SampleSagaState>): void {
    this.state.handleTouchOrderCalled = true;
  }

  @Handle(HandleByAllSampleSaga)
  handleHandleByAllSampleSaga(
    event: HandleByAllSampleSaga,
    context: SagaExecutionContext<SampleSagaState>,
  ): void {
    this.state.handleHandleByAllSampleSaga = true;
  }

  @Handle(CompleteOrder)
  handleCompleteOrder(event: CompleteOrder, context: SagaExecutionContext<SampleSagaState>): void {
    this.state.handleCompleteOrderCalled = true;

    this.markAsComplete();
  }
}
