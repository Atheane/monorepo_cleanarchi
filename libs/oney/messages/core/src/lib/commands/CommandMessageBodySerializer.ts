import { Command } from './Command';
import { CommandMessageBody } from './CommandMessageBody';

export abstract class CommandMessageBodySerializer {
  abstract serialize(messageBody: CommandMessageBody): string;
  abstract deserialize<TCommand extends Command = Command>(event: string): CommandMessageBody<TCommand>;
}
