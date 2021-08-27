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
import { StartOrder } from './events/StartOrder';
import { TouchOrder } from './events/TouchOrder';

export interface SampleSagaState extends SagaState {
  orderId: string;
  handleStartOrderCalled: boolean;
  handleTouchOrderCalled: boolean;
  handleCompleteOrderCalled: boolean;
}

@Saga({ id: 'sample-saga', namespace: '@oney/saga', version: 0 })
export class SampleSaga extends SagaWorkflow<SampleSagaState> {
  public id: string;
  public version: number;

  protected configureHowToFindSaga(mapper: SagaPropertyMapper<SampleSagaState>) {
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
  }

  @StartedBy(StartOrder)
  handleStartOrder(event: StartOrder, context: SagaExecutionContext<SampleSagaState>) {
    this.state.handleStartOrderCalled = true;
    this.state.handleCompleteOrderCalled = false;
    this.state.orderId = event.props.orderId;
  }

  @Handle(TouchOrder)
  handleTouchOrder(event: TouchOrder, context: SagaExecutionContext<SampleSagaState>) {
    this.state.handleTouchOrderCalled = true;
  }

  @Handle(CompleteOrder)
  handleCompleteOrder(event: CompleteOrder, context: SagaExecutionContext<SampleSagaState>) {
    this.state.handleCompleteOrderCalled = true;

    this.markAsComplete();
  }
}
