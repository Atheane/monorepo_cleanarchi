import { OneyExecutionContext } from '@oney/context';
import { Command } from './Command';
import { CommandMessageBody } from './CommandMessageBody';

export abstract class CommandMessageBodyMapper {
  abstract toCommand<TCommand extends Command = Command>(messageBody: CommandMessageBody<TCommand>): TCommand;
  abstract toCommandMessageBody<TCommand extends Command = Command>(
    command: TCommand,
    context?: OneyExecutionContext,
  ): CommandMessageBody<TCommand>;
}
