import { Command, CommandHandler, CommandReceiveContext } from '@oney/messages-core';
import { AsyncOrSync } from 'ts-essentials';

export class SampleCommandHandler implements CommandHandler {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public handle(command: Command, ctx: CommandReceiveContext): AsyncOrSync<void> {
    return;
  }
}
