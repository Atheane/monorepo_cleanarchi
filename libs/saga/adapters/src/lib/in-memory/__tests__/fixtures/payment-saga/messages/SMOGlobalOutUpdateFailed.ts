import { DomainEvent } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { DeepPartial } from 'ts-essentials';

@DecoratedEvent({ name: 'SMOGlobalOutUpdateFailed', namespace: '@oney/saga', version: 0 })
export class SMOGlobalOutUpdateFailed implements DomainEvent<{ userId: string }> {
  constructor(data?: DeepPartial<SMOGlobalOutUpdateFailed>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  public id: string;
  public props: { userId: string };
}
