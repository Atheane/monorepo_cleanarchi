import {
  Command,
  CommandCtor,
  CommandHandlerCtor,
  CommandHandlerRegistration,
  CommandHandlerRegistrationOptions,
  CommandHandlerRegistry,
  CommandMetadata,
} from '@oney/messages-core';

export class DefaultCommandHandlerRegistry extends CommandHandlerRegistry {
  protected _registrations: Map<CommandCtor, CommandHandlerRegistration>;

  constructor() {
    super();
    this._registrations = new Map<CommandCtor, CommandHandlerRegistration>();
  }

  public register<TCommand extends Command>(
    command: CommandCtor<TCommand>,
    handler: CommandHandlerCtor<TCommand>,
    options?: CommandHandlerRegistrationOptions,
  ): void {
    this.assertRegistrationNotExists(command);

    this._registrations.set(command, {
      command,
      handler,
      options: options ?? {},
    });
  }

  assertRegistrationNotExists(command: CommandCtor): void | never {
    if (this._registrations.has(command)) {
      const fullyQualifiedName = CommandMetadata.getFromCtor(command);
      throw new Error(`Handler already registered for command: ${fullyQualifiedName}`);
    }
  }

  public read(): CommandHandlerRegistration[] {
    return Array.from(this._registrations.values()).flat();
  }
}
