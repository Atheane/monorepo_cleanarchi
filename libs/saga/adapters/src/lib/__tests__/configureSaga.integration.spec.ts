import { DefaultCommandHandlerActivator, DefaultTopicProviderFromEvent } from '@oney/messages-adapters';
import {
  CommandDispatcher,
  CommandReceiver,
  EventDispatcher,
  EventReceiver,
  SymTopicProviderFromEventCtor,
} from '@oney/messages-core';
import {
  TestCommandDispatcher,
  TestCommandReceiver,
  TestEventDispatcher,
  TestEventReceiver,
} from '@oney/messages-test';
import { Container } from 'inversify';
import { Connection } from 'mongoose';
import { AsyncOrSync } from 'ts-essentials';
import { configureSaga } from '../configureSaga';
import { MongooseScope } from './__fixtures__/MongooseScope';
import { MongoScope } from './__fixtures__/MongoScope';
import { IncomingFrontEvent } from './__fixtures__/payment-saga/messages/IncomingFrontEvent';
import { PaymentSaga } from './__fixtures__/payment-saga/PaymentSaga';
import { SetupMongoMemory } from './__fixtures__/SetupMongoMemory';

describe('configureSaga', () => {
  SetupMongoMemory();

  const ScopeFactory = async <T>(fn: (connection: Connection) => AsyncOrSync<T>) => {
    await MongoScope(async dbCtx => {
      await MongooseScope(dbCtx.uri, dbCtx.dbName, async connection => {
        return fn(connection);
      });
    });
  };

  function initialize(connection: Connection) {
    const container = new Container();

    if (!container.isBound(Connection)) {
      container.bind(Connection).toConstantValue(connection);
    }

    const eventReceiver = new TestEventReceiver();
    const eventDispatcher = new TestEventDispatcher(eventReceiver);
    container.bind(EventReceiver).toConstantValue(eventReceiver);
    container.bind(EventDispatcher).toConstantValue(eventDispatcher);

    const commandHandlerActivator = new DefaultCommandHandlerActivator(container);
    const commandReceiver = new TestCommandReceiver(commandHandlerActivator);
    const commandDispatcher = new TestCommandDispatcher(commandReceiver);
    container.bind(CommandReceiver).toConstantValue(commandReceiver);
    container.bind(CommandDispatcher).toConstantValue(commandDispatcher);
    container.bind(SymTopicProviderFromEventCtor).to(DefaultTopicProviderFromEvent);

    return container;
  }

  it('should not throw an exception or compile error (touch)', async () => {
    await ScopeFactory(async connection => {
      const container = initialize(connection);

      await configureSaga(container, r => {
        r.register(PaymentSaga, {
          eventTopicMap: new Map([[IncomingFrontEvent, 'something']]),
        });
      });
    });
  });
});
