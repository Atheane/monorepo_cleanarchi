import 'reflect-metadata';
import { Command } from '../Command';
import { CommandCtor } from '../CommandCtor';

const COMMAND_METADATA_SYMBOL = Symbol.for('COMMAND_METADATA_SYMBOL');

export class CommandMetadata<TCommand extends Command = Command> {
  public static ensure<TCommand extends Command>(target: CommandCtor<TCommand>): CommandMetadata<TCommand> {
    if (!Reflect.hasOwnMetadata(COMMAND_METADATA_SYMBOL, target)) {
      const schemaMetadata = new CommandMetadata(target);

      Reflect.defineMetadata(COMMAND_METADATA_SYMBOL, schemaMetadata, target);
    }

    return Reflect.getOwnMetadata(COMMAND_METADATA_SYMBOL, target);
  }

  public static getFromCtor<TCommand extends Command>(
    target: CommandCtor<TCommand>,
  ): CommandMetadata<TCommand> {
    return Reflect.getOwnMetadata(COMMAND_METADATA_SYMBOL, target);
  }

  public static getFromInstance<TCommand extends Command>(target: TCommand): CommandMetadata<TCommand> {
    return Reflect.getOwnMetadata(COMMAND_METADATA_SYMBOL, target.constructor);
  }

  public static getOrThrowFromCtor<TCommand extends Command>(
    target: CommandCtor<TCommand>,
  ): CommandMetadata<TCommand> {
    const metadata = this.getFromCtor<TCommand>(target);

    if (!metadata) {
      throw new Error(`Metadata not found for command: ${target.constructor.name}`);
    }

    return metadata;
  }

  public static getOrThrowFromInstance<TCommand extends Command>(
    target: TCommand,
  ): CommandMetadata<TCommand> {
    const metadata = this.getFromInstance<TCommand>(target);

    if (!metadata) {
      throw new Error(`Metadata not found for command: ${target.constructor.name}`);
    }

    return metadata;
  }

  constructor(target: CommandCtor<TCommand>) {
    this.target = target;
  }

  public target: CommandCtor<TCommand>;
  public name: string;
  public namespace: string;
  public version: number;

  get fullyQualifiedName(): string {
    return CommandMetadata.computeFullyQualifiedName(this.namespace, this.name, this.version);
  }

  static computeFullyQualifiedName(namespace: string, name: string, version: number): string {
    return `${namespace}.${name}.${version}`;
  }
}
