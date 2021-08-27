import { Logger } from '@oney/logger-core';
import { OperationProperties, WriteService } from '@oney/payment-core'; // No tested in unit testing.
import { injectable } from 'inversify';
import * as mongoose from 'mongoose';
import { Collection } from 'mongoose';

/* istanbul ignore next */ @injectable()
export class MongoDbOperationsWriteService implements WriteService {
  collection: Collection;
  logger: Logger;

  constructor(dbConnectionUrl: string, collection: string, database: string, logger: Logger) {
    this.logger = logger;
    this.collection = mongoose
      .createConnection(dbConnectionUrl, { useNewUrlParser: true })
      .useDb(database)
      .collection(collection);
  }

  async upsert<T>(predicate: { [p: string]: any }, data: T): Promise<T> {
    // This Write service is dedicated to writing operations. Since the operations need to update specifically the `version` array, we can't just use the usual WriteService. Could be solved by event sourcing
    const operation = (data as unknown) as OperationProperties;
    const [version] = operation.version;
    const orderId = operation.orderId;
    const uid = operation.uid;
    const cardId = operation.cardId;
    const tid = operation.tid;

    try {
      delete version.refundReference;
      delete version.initialOperation;
      version.linkedTransactions = [];

      const existingTx = await this.collection.findOne({ orderId });

      if (existingTx) {
        this.logger.info(
          `Updating transaction orderid: ${orderId}, version added ${JSON.stringify(version)}`,
        );
        await this.collection.updateOne({ orderId }, { $addToSet: { version } });
        return (operation as unknown) as T;
      }

      this.logger.info(
        `Creating new transaction orderid: ${orderId}, version created ${JSON.stringify(version)}`,
      );
      await this.collection.insertOne({
        orderId,
        uid,
        cardId,
        tid,
        version: [version],
      });
    } catch (e) {
      this.logger.info(
        `Error during createOrUpdateTransaction for orderId: ${orderId}, message: ${e.message}, details: ${e.code}`,
      );
      throw e;
    }
  }
}
