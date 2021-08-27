import { DomainEvent } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { DeepPartial } from 'ts-essentials';

@DecoratedEvent({ name: 'SMOGlobalOutUpdated', namespace: '@oney/saga', version: 0 })
export class SMOGlobalOutUpdated implements DomainEvent<{ userId: string }> {
  constructor(data?: DeepPartial<SMOGlobalOutUpdated>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  public id: string;
  public props: { userId: string };
}
