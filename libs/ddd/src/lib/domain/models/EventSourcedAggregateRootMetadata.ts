import { ClassType } from '@oney/common-core';

export class EventSourcedAggregateRootMetadata<T> {
  constructor(target: ClassType<T>) {
    this.target = target;
    this.name = target.name;
    this.setDefaultValues();
  }
  private setDefaultValues() {
    this.handlers = new Map<string, any>();
  }
  public name: string;
  public target: ClassType<T>;
  public handlers: Map<string, any>;
}
