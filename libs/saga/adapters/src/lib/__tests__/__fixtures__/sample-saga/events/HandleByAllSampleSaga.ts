import { DomainEvent } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { DeepPartial } from 'ts-essentials';

export type Props = {};

@DecoratedEvent({ name: 'HandleByAllSampleSaga', namespace: '@oney/saga', version: 0 })
export class HandleByAllSampleSaga implements DomainEvent<Props> {
  constructor(data?: DeepPartial<HandleByAllSampleSaga>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  public id: string;
  public props: Props;
}
