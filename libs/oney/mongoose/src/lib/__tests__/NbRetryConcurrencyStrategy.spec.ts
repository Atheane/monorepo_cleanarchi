import { MongooseScope, MongoScope, SetupMongoMemory } from '@oney/test';
import { Connection, Error } from 'mongoose';
import { AsyncOrSync } from 'ts-essentials';
import { generateUserModel } from './__fixtures__/UserModel';
import { NbRetryConcurrencyStrategy } from '../NbRetryConcurrencyStrategy';

describe('NbRetryConcurrencyStrategy', () => {
  SetupMongoMemory();

  const ScopeFactory = async <T>(fn: (connection: Connection) => AsyncOrSync<T>) => {
    await MongoScope(async dbCtx => {
      await MongooseScope(dbCtx.uri, dbCtx.dbName, async connection => {
        return fn(connection);
      });
    });
  };

  async function makeConflict(model: any, _id: any) {
    const doc1 = await model.findById(_id);
    const doc2 = await model.findById(_id);

    // Set `status` and save `doc1`
    await makeUpdate(doc1);

    // Set `avatar` and save `doc2`
    // Throws 'VersionError: No matching document found for id "..." version 0'
    await makeUpdate(doc2);
  }

  async function makeUpdate(doc: any) {
    doc.status = doc.status == 'APPROVED' ? 'PENDING' : 'APPROVED';
    await doc.save();
  }

  it('should throw VersionError', async () => {
    await ScopeFactory(async connection => {
      const userModel = generateUserModel(connection);

      const { _id } = await userModel.create({
        status: 'PENDING',
        avatar: 'avatar',
      });

      const execute = () => makeConflict(userModel, _id);

      await expect(execute).rejects.toThrow(Error.VersionError);
    });
  });

  it('should throw VersionError after n retry', async () => {
    await ScopeFactory(async connection => {
      const userModel = generateUserModel(connection);

      const { _id } = await userModel.create({
        status: 'PENDING',
        avatar: 'avatar',
      });

      const strategy = new NbRetryConcurrencyStrategy(2);

      const expectedNbCalls = 3;
      let currentNbCalls = 0;

      const execute = () =>
        strategy.execute(() => {
          currentNbCalls++;
          return makeConflict(userModel, _id);
        });

      await expect(execute).rejects.toThrow(Error.VersionError);
      expect(currentNbCalls).toBe(expectedNbCalls);
    });
  });

  it('should success after n retry', async () => {
    await ScopeFactory(async connection => {
      const userModel = generateUserModel(connection);

      const { _id } = await userModel.create({
        status: 'PENDING',
        avatar: 'avatar',
      });

      const strategy = new NbRetryConcurrencyStrategy(2);

      const expectedNbCalls = 2;
      let currentNbCalls = 0;

      await strategy.execute(async () => {
        currentNbCalls++;

        // success for the second call
        if (currentNbCalls === 2) {
          const doc = await userModel.findById(_id);
          return makeUpdate(doc);
        }
        return makeConflict(userModel, _id);
      });

      expect(currentNbCalls).toBe(expectedNbCalls);
    });
  });
});
