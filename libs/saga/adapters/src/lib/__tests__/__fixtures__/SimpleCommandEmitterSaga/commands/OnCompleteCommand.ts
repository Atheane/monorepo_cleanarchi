import { Command, DecoratedCommand } from '@oney/messages-core';
import { DeepPartial } from 'ts-essentials';

export type Props = { content: string };

@DecoratedCommand({ name: 'OnCompleteCommand', namespace: '@oney/saga', version: 0 })
export class OnCompleteCommand implements Command<Props> {
  constructor(data?: DeepPartial<OnCompleteCommand>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  public id: string;
  public props: Props;
}
