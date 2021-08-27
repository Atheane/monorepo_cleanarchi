import { defaultLogger } from '@oney/logger-adapters';
import {
  Connection,
  Schema,
  SchemaDefinition,
  SchemaOptions,
  connection as defaultConnection,
  Document,
  Model,
} from 'mongoose';

export class MongooseModelFactory {
  private _connection: Connection;

  constructor(connection?: Connection) {
    if (connection) {
      this._connection = connection;
    } else {
      this._connection = defaultConnection;
    }
  }

  create<T extends Document>(name: string, definition: SchemaDefinition, options?: SchemaOptions): Model<T> {
    const defaultOptions: SchemaOptions = {
      optimisticConcurrency: true,
      minimize: false,
      strict: 'throw',
      strictQuery: true,
      useNestedStrict: true,
      emitIndexErrors: true,
      typePojoToMixed: false,
    };

    const mergedOptions = {
      ...defaultOptions,
      ...options,
    };

    const schema = new Schema<T>(definition, mergedOptions);

    const model = this._connection.model<T>(name, schema);

    model.on('index', error => {
      if (error) {
        defaultLogger.error('onIndex:', error);
      }
    });

    model.on('error', error => {
      defaultLogger.error(`onError: ${error}`, { model: name, error });
    });

    defaultLogger.info(`${MongooseModelFactory.name} used for mongoose Model ${name}`, {
      options: mergedOptions,
    });

    return model;
  }
}
