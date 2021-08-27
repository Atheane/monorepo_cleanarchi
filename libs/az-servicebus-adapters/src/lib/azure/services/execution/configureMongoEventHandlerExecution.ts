import {
  EventHandlerExecutionFinder,
  EventHandlerExecutionRepository,
  EventHandlerExecutionStore,
} from '@oney/messages-core';
import { Container } from 'inversify';
import { Connection } from 'mongoose';
import { DefaultEventHandlerExecutionStore } from './DefaultEventHandlerExecutionStore';
import { DefaultEventHandlerExecutionFinder } from './DefaultEventHandlerExecutionFinder';
import { MongoEventHandlerExecutionRepository } from './mongo/MongoEventHandlerExecutionRepository';
import { connectEventHandlerExecutionModel } from './mongo/schemas/EventHandlerExecutionSchema';

export function configureMongoEventHandlerExecution(container: Container) {
  if (!container.isBound(Connection)) {
    throw new Error('Mongoose should be initialize before EventHandlerExecution');
  }

  const connection = container.get(Connection);

  const model = connectEventHandlerExecutionModel(connection);

  const repository = new MongoEventHandlerExecutionRepository(model);

  container.bind(MongoEventHandlerExecutionRepository).toConstantValue(repository);
  container.bind(EventHandlerExecutionRepository).toConstantValue(repository);

  const finder = new DefaultEventHandlerExecutionFinder(repository);

  container.bind(DefaultEventHandlerExecutionFinder).toConstantValue(finder);
  container.bind(EventHandlerExecutionFinder).toConstantValue(finder);

  const store = new DefaultEventHandlerExecutionStore(repository);

  container.bind(DefaultEventHandlerExecutionStore).toConstantValue(store);
  container.bind(EventHandlerExecutionStore).toConstantValue(store);
}
