import { Event } from '@oney/messages-core';
import { injectable } from 'inversify';
import { Duration } from 'luxon';
import { SagaState } from './SagaState';
import { SagaExecutionContext } from '../SagaExecutionContext';
import { SagaPropertyMapper } from '../mapper/SagaPropertyMapper';
import { SagaWorkflowCtor } from '../types/SagaWorkflowCtor';

@injectable()
export abstract class SagaWorkflow<TSagaState extends SagaState> {
  static configure<TSagaState extends SagaState>(saga: SagaWorkflowCtor<TSagaState>) {
    const instance = new saga();
    const mapper = new SagaPropertyMapper<TSagaState>(instance);
    instance.configureHowToFindSaga(mapper);
  }

  constructor() {
    this.completedAt = undefined;
  }

  /// <summary>
  /// The saga's typed data.
  /// </summary>
  public state: TSagaState;

  /// <summary>
  /// Indicates that the saga is complete.
  /// In order to set this value, use the <see cref="MarkAsComplete" /> method.
  /// </summary>
  public completedAt?: Date;

  protected abstract configureHowToFindSaga(mapper: SagaPropertyMapper<TSagaState>): void;

  /// <summary>
  /// Marks the saga as complete.
  /// This may result in the sagas state being deleted by the persister.
  /// </summary>
  protected markAsComplete(): void {
    this.completedAt = new Date();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  requestTimeout<TSagaState extends SagaState>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context: SagaExecutionContext<TSagaState>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    duration: Duration,
  ): Promise<void> {
    // todo
    // throw new Error('NOT_IMPLEMENTED');
    return Promise.resolve();
  }

  requestTimeoutWithTimeoutMessage<TSagaState extends SagaState>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context: SagaExecutionContext<TSagaState>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    duration: Duration,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    message: Event,
  ): Promise<void> {
    // todo
    // throw new Error('NOT_IMPLEMENTED');
    return Promise.resolve();
  }

  // todo update state
}
