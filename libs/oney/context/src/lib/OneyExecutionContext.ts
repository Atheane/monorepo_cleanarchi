import { OneyContext } from '@oney/context';

export interface OneyExecutionContext extends OneyContext {
  /**
   * Represent an execution context id,
   * it should b equals to correlationId,
   * when it is the same service that initializes the correlationId
   */
  executionId?: string;
}
