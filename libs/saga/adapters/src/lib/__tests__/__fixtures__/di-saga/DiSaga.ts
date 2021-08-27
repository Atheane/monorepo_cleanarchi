/* eslint @typescript-eslint/no-unused-vars: 0 */

import {
  Handle,
  Saga,
  SagaExecutionContext,
  SagaPropertyMapper,
  SagaWorkflow,
  StartedBy,
} from '@oney/saga-core';
import { injectable } from 'inversify';
import { CompleteOrder } from '../sample-saga/events/CompleteOrder';
import { StartOrder } from '../sample-saga/events/StartOrder';
import { TouchOrder } from '../sample-saga/events/TouchOrder';
import { SampleSaga, SampleSagaState } from '../sample-saga/SampleSaga';

@injectable()
export class DependantService {
  name = 'DependantService';
}

@Saga({ id: 'di-saga', namespace: '@oney/saga', version: 0 })
export class DiSaga extends SagaWorkflow<SampleSagaState> {
  constructor(private readonly _service: DependantService) {
    super();
  }

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

  @Handle(CompleteOrder)
  handleCompleteOrder(event: CompleteOrder, context: SagaExecutionContext<SampleSagaState>): void {
    this.state.handleCompleteOrderCalled = true;

    this.markAsComplete();
  }

  get hasService(): boolean {
    return !!this._service;
  }
}
