import { OneyExecutionContext } from '@oney/context';

export interface EventJson<T = any> {
  readonly id: string;
  readonly name: string;
  readonly timestamp: number;
  readonly namespace: string;
  readonly version: number;
  readonly context: OneyExecutionContext;
  readonly payload: T;
}
