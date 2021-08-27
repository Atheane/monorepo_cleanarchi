import { SagaState } from '@oney/saga-core';
import { ProfileStatus } from '@oney/profile-messages';
import { CommandStrategy } from './CommandStrategy';
import { StatusStrategyFactory } from './StatusStrategyFactory';

export class StatusStrategy {
  strategy: CommandStrategy<SagaState>;

  constructor(label: ProfileStatus) {
    this.strategy = StatusStrategyFactory.from(label);
  }
}
