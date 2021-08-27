import { DomainEvent } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { DeepPartial } from 'ts-essentials';

export type Props = { content: string };

@DecoratedEvent({ name: 'TouchSimpleCommandEmitterSagaEvent', namespace: '@oney/saga', version: 0 })
export class TouchSimpleCommandEmitterSagaEvent implements DomainEvent<Props> {
  constructor(data?: DeepPartial<TouchSimpleCommandEmitterSagaEvent>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  public id: string;
  public props: Props;
}
