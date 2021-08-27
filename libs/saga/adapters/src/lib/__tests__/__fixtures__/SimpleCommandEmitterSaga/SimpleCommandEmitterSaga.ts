import {
  Handle,
  Saga,
  SagaExecutionContext,
  SagaPropertyMapper,
  SagaState,
  SagaWorkflow,
  StartedBy,
} from '@oney/saga-core';
import { v4 } from 'uuid';
import { OnCompleteCommand } from './commands/OnCompleteCommand';
import { OnStartCommand } from './commands/OnStartCommand';
import { OnTouchCommand } from './commands/OnTouchCommand';
import { CompleteSimpleCommandEmitterSagaEvent } from './events/CompleteSimpleCommandEmitterSagaEvent';
import { StartSimpleCommandEmitterSagaEvent } from './events/StartSimpleCommandEmitterSagaEvent';
import { TouchSimpleCommandEmitterSagaEvent } from './events/TouchSimpleCommandEmitterSagaEvent';

export interface SimpleCommandEmitterSagaState extends SagaState {
  content: string;
}

@Saga({ id: 'simple-event-emitter-saga', namespace: '@oney/saga', version: 0 })
export class SimpleCommandEmitterSaga extends SagaWorkflow<SimpleCommandEmitterSagaState> {
  protected configureHowToFindSaga(mapper: SagaPropertyMapper<SimpleCommandEmitterSagaState>): void {
    mapper
      .configureMapping(StartSimpleCommandEmitterSagaEvent)
      .fromEvent(message => message.props.content)
      .toSaga(sagaData => sagaData.content);

    mapper
      .configureMapping(TouchSimpleCommandEmitterSagaEvent)
      .fromEvent(message => message.props.content)
      .toSaga(sagaData => sagaData.content);

    mapper
      .configureMapping(CompleteSimpleCommandEmitterSagaEvent)
      .fromEvent(message => message.props.content)
      .toSaga(sagaData => sagaData.content);
  }

  @StartedBy(StartSimpleCommandEmitterSagaEvent)
  async handleStartSimpleCommandEmitterSagaEvent(
    event: StartSimpleCommandEmitterSagaEvent,
    context: SagaExecutionContext<SimpleCommandEmitterSagaState>,
  ): Promise<void> {
    this.state.content = event.props.content;

    await context.commandDispatcher.dispatch(
      new OnStartCommand({
        id: v4(),
        props: {
          ...event.props,
        },
      }),
    );
  }

  @Handle(TouchSimpleCommandEmitterSagaEvent)
  async handleTouchSimpleCommandEmitterSagaEvent(
    event: TouchSimpleCommandEmitterSagaEvent,
    context: SagaExecutionContext<SimpleCommandEmitterSagaState>,
  ): Promise<void> {
    this.state.content = event.props.content;

    await context.commandDispatcher.dispatch(
      new OnTouchCommand({
        id: v4(),
        props: {
          ...event.props,
        },
      }),
    );
  }

  @Handle(CompleteSimpleCommandEmitterSagaEvent)
  async handleCompleteSimpleCommandEmitterSagaEvent(
    event: CompleteSimpleCommandEmitterSagaEvent,
    context: SagaExecutionContext<SimpleCommandEmitterSagaState>,
  ): Promise<void> {
    this.state.content = event.props.content;

    await context.commandDispatcher.dispatch(
      new OnCompleteCommand({
        id: v4(),
        props: {
          ...event.props,
        },
      }),
    );

    this.markAsComplete();
  }
}
