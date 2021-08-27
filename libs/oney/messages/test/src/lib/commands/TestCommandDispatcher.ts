import { defaultLogger } from '@oney/logger-adapters';
import { Command, CommandDispatcher, CommandDispatcherOptions } from '@oney/messages-core';
import { injectable } from 'inversify';
import { TestCommandReceiver } from './TestCommandReceiver';

@injectable()
export class TestCommandDispatcher extends CommandDispatcher {
  private _receiver: TestCommandReceiver;

  constructor(receiver: TestCommandReceiver) {
    super();
    this._receiver = receiver;
  }

  public async doDispatch(commands: Command[], options?: CommandDispatcherOptions): Promise<void> {
    for (const command of commands) {
      if (options?.scheduledEnqueueTimeUtc) {
        const delta = options.scheduledEnqueueTimeUtc.getTime() - Date.now();

        defaultLogger.info(`${command.constructor.name} scheduled to be send in ${delta} ms`);

        setTimeout(async () => {
          await this._receiver.inject(command);
        }, delta);
      } else {
        await this._receiver.inject(command);
      }
    }
  }
}
