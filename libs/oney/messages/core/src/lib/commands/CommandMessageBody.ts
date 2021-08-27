import { Command } from './Command';
import { MessageBody } from '../messages/MessageBody';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CommandMessageBody<TCommand extends Command = Command> extends MessageBody<TCommand> {}
