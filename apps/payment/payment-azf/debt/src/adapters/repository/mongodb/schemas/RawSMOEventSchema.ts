import { connection, Connection, Document, Model, Schema } from 'mongoose';

export type RawSMOEventProperties = {
  date: Date;
  type: string;
  data: any;
  version: number;
} & Document;

export class RawSMOEventSchema extends Schema {
  constructor() {
    super(
      {
        date: {
          type: Date,
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
        data: {
          type: Schema.Types.Mixed,
          required: true,
        },
        version: {
          type: Number,
          required: true,
        },
      },
      {
        versionKey: false,
      },
    );
  }
}

export class EventStoreMongoConnection {
  private eventStoreIdentifier = 'smo_events';
  private eventStore: Connection;
  private debtEventStore: Model<RawSMOEventProperties>;

  init(): EventStoreMongoConnection {
    this.eventStore = connection.useDb('odb_eventstore');
    this.debtEventStore = this.eventStore.model<RawSMOEventProperties>(
      this.eventStoreIdentifier,
      new RawSMOEventSchema(),
    );
    return this;
  }

  getStore(): Model<RawSMOEventProperties> {
    return this.debtEventStore;
  }
}
