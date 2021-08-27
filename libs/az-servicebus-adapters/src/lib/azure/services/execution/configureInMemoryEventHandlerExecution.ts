import {
  EventHandlerExecutionFinder,
  EventHandlerExecutionRepository,
  EventHandlerExecutionStore,
} from '@oney/messages-core';
import { Container } from 'inversify';
import { DefaultEventHandlerExecutionStore } from './DefaultEventHandlerExecutionStore';
import { DefaultEventHandlerExecutionFinder } from './DefaultEventHandlerExecutionFinder';
import { InMemoryEventHandlerExecutionRepository } from './in-memory/InMemoryEventHandlerExecutionRepository';

export function configureInMemoryEventHandlerExecution(container: Container): void {
  const repository = new InMemoryEventHandlerExecutionRepository();

  container.bind(InMemoryEventHandlerExecutionRepository).toConstantValue(repository);
  container.bind(EventHandlerExecutionRepository).toConstantValue(repository);

  const finder = new DefaultEventHandlerExecutionFinder(repository);

  container.bind(DefaultEventHandlerExecutionFinder).toConstantValue(finder);
  container.bind(EventHandlerExecutionFinder).toConstantValue(finder);

  const store = new DefaultEventHandlerExecutionStore(repository);

  container.bind(DefaultEventHandlerExecutionStore).toConstantValue(store);
  container.bind(EventHandlerExecutionStore).toConstantValue(store);
}
