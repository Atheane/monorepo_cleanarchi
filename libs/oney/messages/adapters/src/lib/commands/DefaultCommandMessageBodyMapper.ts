import { OneyExecutionContext } from '@oney/context';
import { defaultLogger } from '@oney/logger-adapters';
import {
  CommandMetadata,
  Command,
  CommandMessageBody,
  CommandMessageBodyMapper,
  StaticCommandRegistry,
} from '@oney/messages-core';
import { injectable } from 'inversify';

@injectable()
export class DefaultCommandMessageBodyMapper extends CommandMessageBodyMapper {
  public toCommand<TCommand extends Command = Command>(messageBody: CommandMessageBody<TCommand>): TCommand {
    const metadata = StaticCommandRegistry.get(messageBody.namespace, messageBody.name, messageBody.version);

    let command: TCommand;
    if (metadata) {
      command = new metadata.target() as TCommand;
    } else {
      defaultLogger.warn(
        `Command constructor not found for: ${messageBody.name}`,
        this.extractBodyWithoutPayload(messageBody),
      );
      command = {} as TCommand;
    }

    Object.assign(command, messageBody.payload);

    return command;
  }

  public toCommandMessageBody<TCommand extends Command = Command>(
    command: TCommand,
    context?: OneyExecutionContext,
  ): CommandMessageBody<TCommand> {
    const metadata = CommandMetadata.getFromInstance(command);

    const messageBody: CommandMessageBody<TCommand> = {
      id: command.id,
      name: metadata.name,
      timestamp: Date.now(),
      namespace: metadata.namespace,
      version: metadata.version,
      context: context,
      // todo make a better method to capture the custom event properties outside of props
      payload: command,
    };

    return messageBody;
  }

  // todo make a factoize helper for that
  private extractBodyWithoutPayload(messageBody: CommandMessageBody): Omit<CommandMessageBody, 'payload'> {
    const result = {
      ...messageBody,
    };

    delete result.payload;

    return result;
  }
}
