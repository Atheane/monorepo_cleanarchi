import { Disposable } from '@oney/core';
import { injectable } from 'inversify';
import { AsyncOrSync } from 'ts-essentials';
import { Command } from './Command';
import { CommandCtor } from './CommandCtor';
import { CommandMessageBodyMapper } from './CommandMessageBodyMapper';
import { CommandMessageBodySerializer } from './CommandMessageBodySerializer';
import { CommandHandlerCtor } from './handlers/CommandHandlerCtor';

export interface CommandReceiverOptions {
  customMapper?: CommandMessageBodyMapper;
  customSerializer?: CommandMessageBodySerializer;
}

@injectable()
export abstract class CommandReceiver {
  abstract subscribe<TCommand extends Command>(
    commandCtor: CommandCtor<TCommand>,
    handlerCtor: CommandHandlerCtor<TCommand>,
    options?: CommandReceiverOptions,
  ): AsyncOrSync<Disposable>;
}
