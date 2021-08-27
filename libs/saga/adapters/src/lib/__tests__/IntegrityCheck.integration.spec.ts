import 'reflect-metadata';
import { Saga, SagaPropertyMapper, SagaWorkflow } from '@oney/saga-core';
import { Connection } from 'mongoose';
import { AsyncOrSync } from 'ts-essentials';
import { MongooseScope } from './__fixtures__/MongooseScope';
import { MongoScope } from './__fixtures__/MongoScope';
import { sagaInitialize } from './__fixtures__/SagaInitialize';
import { SampleSaga, SampleSagaState } from './__fixtures__/sample-saga/SampleSaga';
import { SetupMongoMemory } from './__fixtures__/SetupMongoMemory';

describe('IntegrityCheck', () => {
  SetupMongoMemory();

  const ScopeFactory = async <T>(fn: (connection: Connection) => AsyncOrSync<T>) => {
    await MongoScope(async dbCtx => {
      await MongooseScope(dbCtx.uri, dbCtx.dbName, async connection => {
        return fn(connection);
      });
    });
  };

  it('should throw an error when we register 2 times a same saga', async () => {
    await ScopeFactory(async connection => {
      const shouldThrow = async () =>
        await sagaInitialize(connection, r => {
          r.register(SampleSaga);
          r.register(SampleSaga);
        });

      await expect(shouldThrow).rejects.toThrow();
    });
  });

  it('should throw an error when we register 2 saga with same fullyQualifiedName', async () => {
    await ScopeFactory(async connection => {
      @Saga({ id: 'sample-saga', namespace: '@oney/saga', version: 0 })
      class SameSaga extends SagaWorkflow<SampleSagaState> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        protected configureHowToFindSaga(mapper: SagaPropertyMapper<SampleSagaState>) {
          // nothing
        }
      }

      const shouldThrow = async () =>
        await sagaInitialize(connection, r => {
          r.register(SampleSaga);
          r.register(SameSaga);
        });

      await expect(shouldThrow).rejects.toThrow();
    });
  });
});
