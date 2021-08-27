import { DefaultCommandHandlerActivator, DefaultTopicProviderFromEvent } from '@oney/messages-adapters';
import {
  CommandDispatcher,
  CommandHandler,
  CommandReceiveContext,
  CommandReceiver,
  EventDispatcher,
  EventReceiver,
  SymTopicProviderFromEventCtor,
} from '@oney/messages-core';
import { SagaFinder, SagaRegistry, SagaWorkflowCtor } from '@oney/saga-core';
import { Container, injectable } from 'inversify';
import { Connection } from 'mongoose';
import { AsyncOrSync } from 'ts-essentials';
import { v4 } from 'uuid';
import {
  TestCommandDispatcher,
  TestCommandReceiver,
  TestEventDispatcher,
  TestEventReceiver,
} from '@oney/messages-test';
import { MongooseScope } from './__fixtures__/MongooseScope';
import { MongoScope } from './__fixtures__/MongoScope';
import { SetupMongoMemory } from './__fixtures__/SetupMongoMemory';
import { configureSaga } from '../configureSaga';
import { OnStartCommand } from './__fixtures__/SimpleCommandEmitterSaga/commands/OnStartCommand';
import { StartSimpleCommandEmitterSagaEvent } from './__fixtures__/SimpleCommandEmitterSaga/events/StartSimpleCommandEmitterSagaEvent';
import { SimpleCommandEmitterSaga } from './__fixtures__/SimpleCommandEmitterSaga/SimpleCommandEmitterSaga';

describe('SimpleCommandEmitterSaga', () => {
  SetupMongoMemory();

  const ScopeFactory = async <T>(fn: (connection: Connection) => AsyncOrSync<T>) => {
    await MongoScope(async dbCtx => {
      await MongooseScope(dbCtx.uri, dbCtx.dbName, async connection => {
        return fn(connection);
      });
    });
  };

  let commandReceiver: TestCommandReceiver;
  let eventDispatcher: TestEventDispatcher;
  let finder: SagaFinder;

  async function initialize(connection: Connection, cb: (o: SagaRegistry) => AsyncOrSync<void>) {
    const container = new Container();

    if (!container.isBound(Connection)) {
      container.bind(Connection).toConstantValue(connection);
    }

    const eventReceiver = new TestEventReceiver();
    eventDispatcher = new TestEventDispatcher(eventReceiver);
    container.bind(EventReceiver).toConstantValue(eventReceiver);
    container.bind(EventDispatcher).toConstantValue(eventDispatcher);

    const commandHandlerActivator = new DefaultCommandHandlerActivator(container);
    commandReceiver = new TestCommandReceiver(commandHandlerActivator);
    const commandDispatcher = new TestCommandDispatcher(commandReceiver);
    container.bind(CommandReceiver).toConstantValue(commandReceiver);
    container.bind(CommandDispatcher).toConstantValue(commandDispatcher);
    container.bind(SymTopicProviderFromEventCtor).to(DefaultTopicProviderFromEvent);

    await configureSaga(container, cb);

    finder = container.get(SagaFinder);

    return container;
  }

  async function checkActiveSagaCount(saga: SagaWorkflowCtor, count) {
    const activeSagas = await finder.findActiveSagasBySaga(saga);
    expect(activeSagas.length).toBe(count);
  }

  it('should be rework to test a real command emitter saga', async () => {
    await ScopeFactory(async connection => {
      await initialize(connection, r => {
        r.register(SimpleCommandEmitterSaga, {
          eventTopicMap: new Map([[StartSimpleCommandEmitterSagaEvent, 'something']]),
        });
      });

      let OnStartCommandHandlerCalled = false;

      @injectable()
      class OnStartCommandHandler implements CommandHandler<OnStartCommand> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        public handle(command: OnStartCommand, ctx: CommandReceiveContext): AsyncOrSync<void> {
          OnStartCommandHandlerCalled = true;
        }
      }

      await commandReceiver.subscribe(OnStartCommand, OnStartCommandHandler);

      await eventDispatcher.dispatch(
        new StartSimpleCommandEmitterSagaEvent({
          id: v4(),
          props: {
            content: '3712',
          },
        }),
      );

      await checkActiveSagaCount(SimpleCommandEmitterSaga, 1);

      expect(OnStartCommandHandlerCalled).toBe(true);
    });
  });
});
