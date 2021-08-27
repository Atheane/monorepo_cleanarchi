import { Command, DecoratedCommand } from '@oney/messages-core';
import { DeepPartial } from 'ts-essentials';

export type Props = { content: string };

@DecoratedCommand({ name: 'OnTouchCommand', namespace: '@oney/saga', version: 0 })
export class OnTouchCommand implements Command<Props> {
  constructor(data?: DeepPartial<OnTouchCommand>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  public id: string;
  public props: Props;
}
