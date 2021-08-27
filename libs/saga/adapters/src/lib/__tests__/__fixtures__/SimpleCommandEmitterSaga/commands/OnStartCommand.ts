import { Command, DecoratedCommand } from '@oney/messages-core';
import { DeepPartial } from 'ts-essentials';

export type Props = { content: string };

@DecoratedCommand({ name: 'OnStartCommand', namespace: '@oney/saga', version: 0 })
export class OnStartCommand implements Command<Props> {
  constructor(data?: DeepPartial<OnStartCommand>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  public id: string;
  public props: Props;
}
