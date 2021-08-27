import { JSONConvert } from '@oney/common-core';
import {
  Command,
  CommandMessageBody,
  CommandMessageBodySerializer,
  StaticCommandRegistry,
} from '@oney/messages-core';
import { injectable } from 'inversify';

@injectable()
export class DefaultCommandMessageBodySerializer extends CommandMessageBodySerializer {
  public deserialize<TCommand extends Command = Command>(event: string): CommandMessageBody<TCommand> {
    const message: CommandMessageBody<TCommand> = JSONConvert.deserialize(event);

    const metadata = StaticCommandRegistry.get(message.namespace, message.name, message.version);
    if (!metadata) {
      throw new Error(
        `Cannot deserialize ${message.name}, because it not found in the ${StaticCommandRegistry.name}`,
      );
    }

    const instance = new metadata.target() as TCommand;

    // todo make a better method to capture the custom event properties outside of props
    // it is a side effect
    Object.assign(instance, message.payload);

    message.payload = instance;

    return message;
  }

  public serialize(messageBody: CommandMessageBody): string {
    return JSONConvert.serialize(messageBody);
  }
}
