import { CommandMetadata } from './CommandMetadata';
import { Command } from '../Command';
import { CommandCtor } from '../CommandCtor';

// it's not the best solution,
// we need a not static EventRegistry,
// but to have a graceful migration we need that
export class StaticCommandRegistry {
  static registry: Map<string, CommandMetadata> = new Map<string, CommandMetadata>();

  static register<TCommand extends Command>(event: CommandCtor<TCommand>) {
    const metadata = CommandMetadata.getFromCtor(event);

    const key = this.computeKey(metadata.namespace, metadata.name, metadata.version);
    this.registry.set(key, metadata);
  }

  static get(namespace: string, name: string, version: number) {
    const key = this.computeKey(namespace, name, version);
    return this.registry.get(key);
  }

  static has(namespace: string, name: string, version: number) {
    const key = this.computeKey(namespace, name, version);
    return this.registry.has(key);
  }

  private static computeKey(namespace: string, name: string, version: number) {
    return `${namespace}->${name}->v${version}`;
  }
}
