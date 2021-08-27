import { Uuid } from '@oney/core';

export interface SagaState {
  /// <summary>
  /// Gets/sets the instanceId. Do NOT generate this value in saga code.
  /// The value of the Id will be generated automatically to provide the
  /// best performance for saving in a database.
  /// </summary>
  instanceId: Uuid;

  /// <summary>
  /// Contains the return address of the endpoint that caused the process to run.
  /// </summary>
  //originator?: string;

  /// <summary>
  /// Contains the Id of the event which caused the saga to start.
  /// [NOT_IMPLEMENTED] This is needed so that when we reply to the Originator, any
  /// registered callbacks will be fired correctly.
  /// </summary>
  //originalEventId?: Uuid;
}
