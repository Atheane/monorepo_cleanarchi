import {
  CommandHandlerRegistry,
  CommandReceiver,
  Command,
  CommandCtor,
  CommandHandlerCtor,
  CommandHandlerRegistration,
  CommandHandlerRegistrationOptions,
  QueueProviderFromCommandCtor,
} from '@oney/messages-core';
import { injectable } from 'inversify';

// it's a temporary implementation before @oney/application introduction
@injectable()
export class CommandManager {
  private _receiver: CommandReceiver;
  private _registry: CommandHandlerRegistry;
  private _queueProvider: QueueProviderFromCommandCtor;

  constructor(
    receiver: CommandReceiver,
    registry: CommandHandlerRegistry,
    queueProvider: QueueProviderFromCommandCtor,
  ) {
    this._receiver = receiver;
    this._registry = registry;
    this._queueProvider = queueProvider;
  }

  register<TCommand extends Command>(
    command: CommandCtor<TCommand>,
    handler: CommandHandlerCtor<TCommand>,
    options?: CommandHandlerRegistrationOptions,
  ): this {
    this._registry.register(command, handler, options);
    return this;
  }

  async start(): Promise<void> {
    const registrations = await this._registry.read();
    const promises = registrations.map(x => this.doRegistration(x));

    await Promise.all(promises);
  }

  private async doRegistration(registration: CommandHandlerRegistration) {
    await this._receiver.subscribe(registration.command, registration.handler, {
      customMapper: registration.options.customMapper,
      customSerializer: registration.options.customSerializer,
    });
  }
}
