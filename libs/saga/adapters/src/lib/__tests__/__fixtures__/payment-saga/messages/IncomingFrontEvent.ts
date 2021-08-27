import { DomainEvent } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { DeepPartial } from 'ts-essentials';

@DecoratedEvent({ name: 'IncomingFrontEvent', namespace: '@oney/saga', version: 0 })
export class IncomingFrontEvent implements DomainEvent<{ userId: string }> {
  constructor(data?: DeepPartial<IncomingFrontEvent>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  public id: string;
  public props: { userId: string };
}
