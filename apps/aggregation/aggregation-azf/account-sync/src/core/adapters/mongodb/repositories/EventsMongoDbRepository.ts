import { Model, Connection } from 'mongoose';
import { EventRepository } from '../../../domain/repositories';
import { Event } from '../../../domain/types';
import { getEventModel, EventDoc } from '../models/Event';

export class EventsMongoDbRepository implements EventRepository {
  private readonly eventModel: Model<EventDoc>;

  constructor(dbConnection: Connection) {
    this.eventModel = getEventModel(dbConnection);
  }

  async getAll(): Promise<Event[]> {
    const result = await this.eventModel.find({}).lean();
    return result.map(event => ({
      date: event.date,
      type: event.type,
      data: event.data,
      version: event.version,
    }));
  }

  save(events: Event[]): Promise<EventDoc[]> {
    return this.eventModel.create(events);
  }

  async deleteMany(ids: string[]): Promise<void> {
    await Promise.all(
      ids.map(async id => {
        console.log(`Transactions with account id ${id} are deleted`);
        await this.eventModel.deleteMany({ 'data.id': parseInt(id) });
      }),
    );
  }
}
